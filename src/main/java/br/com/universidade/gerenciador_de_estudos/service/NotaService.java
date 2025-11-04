package br.com.universidade.gerenciador_de_estudos.service;

import br.com.universidade.gerenciador_de_estudos.model.Materia;
import br.com.universidade.gerenciador_de_estudos.model.Nota;
import br.com.universidade.gerenciador_de_estudos.model.Usuario;
import br.com.universidade.gerenciador_de_estudos.repository.MateriaRepository;
import br.com.universidade.gerenciador_de_estudos.repository.NotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotaService {

    @Autowired
    private NotaRepository notaRepository;

    @Autowired
    private MateriaRepository materiaRepository;

    public Nota criarNota(Nota nota, Integer idMateria) {
        Usuario usuarioLogado = getUsuarioLogado();

        Materia materia = materiaRepository.findById(idMateria)
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada!"));

        if (!materia.getUsuario().getIdUsuario().equals(usuarioLogado.getIdUsuario())) {
            throw new RuntimeException("Acesso negado: Esta matéria não pertence a você.");
        }

        nota.setMateria(materia);
        return notaRepository.save(nota);
    }

    public List<Nota> listarNotasDaMateria(Integer idMateria) {
        Usuario usuarioLogado = getUsuarioLogado();

        Materia materia = materiaRepository.findById(idMateria)
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada!"));

        if (!materia.getUsuario().getIdUsuario().equals(usuarioLogado.getIdUsuario())) {
            throw new RuntimeException("Acesso negado: Esta matéria não pertence a você.");
        }

        return notaRepository.findByMateria(materia);
    }


    public void deletarNota(Integer idNota) {
        Usuario usuarioLogado = getUsuarioLogado();

        Nota nota = notaRepository.findById(idNota)
                .orElseThrow(() -> new RuntimeException("Nota não encontrada!"));


        if (!nota.getMateria().getUsuario().getIdUsuario().equals(usuarioLogado.getIdUsuario())) {
            throw new RuntimeException("Acesso negado: Esta nota não pertence a você.");
        }

        notaRepository.delete(nota);
    }

    private Usuario getUsuarioLogado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Nenhum usuário autenticado encontrado.");
        }
        return (Usuario) authentication.getPrincipal();
    }
}