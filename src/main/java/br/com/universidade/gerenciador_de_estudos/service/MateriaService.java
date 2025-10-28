package br.com.universidade.gerenciador_de_estudos.service;

import br.com.universidade.gerenciador_de_estudos.model.Materia;
import br.com.universidade.gerenciador_de_estudos.model.Usuario;
import br.com.universidade.gerenciador_de_estudos.repository.MateriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MateriaService {

    @Autowired
    private MateriaRepository materiaRepository;

    /**
     * Busca todas as matérias que pertencem ao usuário logado.
     */
    public List<Materia> listarMateriasDoUsuarioLogado() {
        // Pega os dados do usuário que foi autenticado pelo nosso SecurityFilter
        Usuario usuarioLogado = getUsuarioLogado();

        // No futuro, podemos otimizar isso criando um método no repository
        // return materiaRepository.findByUsuario(usuarioLogado);


        return materiaRepository.findAll().stream()
                .filter(materia -> materia.getUsuario().getIdUsuario().equals(usuarioLogado.getIdUsuario()))
                .toList();
    }


    public Materia criarMateria(Materia materia) {
        // Pega os dados do usuário que fez a requisição
        Usuario usuarioLogado = getUsuarioLogado();

        // "Anexa" o usuário logado à matéria antes de salvar
        materia.setUsuario(usuarioLogado);

        return materiaRepository.save(materia);
    }


    public Materia atualizarMateria(Integer idMateria, Materia dadosAtualizados) {
        Usuario usuarioLogado = getUsuarioLogado();

        Materia materiaExistente = materiaRepository.findById(idMateria)
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada!"));

        // Verifica se o usuário logado é o dono da matéria
        if (!materiaExistente.getUsuario().getIdUsuario().equals(usuarioLogado.getIdUsuario())) {
            throw new RuntimeException("Acesso negado: Você não é o dono desta matéria.");
        }

        // Atualiza os campos
        materiaExistente.setNomeMateria(dadosAtualizados.getNomeMateria());
        materiaExistente.setTema(dadosAtualizados.getTema());

        return materiaRepository.save(materiaExistente);
    }


    public void deletarMateria(Integer idMateria) {
        Usuario usuarioLogado = getUsuarioLogado();

        Materia materiaExistente = materiaRepository.findById(idMateria)
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada!"));

        // Verifica se o usuário logado é o dono da matéria
        if (!materiaExistente.getUsuario().getIdUsuario().equals(usuarioLogado.getIdUsuario())) {
            throw new RuntimeException("Acesso negado: Você não é o dono desta matéria.");
        }

        materiaRepository.delete(materiaExistente);
    }


    private Usuario getUsuarioLogado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Nenhum usuário autenticado encontrado.");
        }
        // SecurityFilter garante que o 'Principal' é o nosso objeto 'Usuario'
        return (Usuario) authentication.getPrincipal();
    }
}