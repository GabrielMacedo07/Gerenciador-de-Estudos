package br.com.universidade.gerenciador_de_estudos.service;

import br.com.universidade.gerenciador_de_estudos.model.Materia;
import br.com.universidade.gerenciador_de_estudos.model.Evento;
import br.com.universidade.gerenciador_de_estudos.model.Usuario;
import br.com.universidade.gerenciador_de_estudos.repository.MateriaRepository;
import br.com.universidade.gerenciador_de_estudos.repository.EventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventoService { // 2. Nome da classe atualizado

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private MateriaRepository materiaRepository;

    public Evento criarEvento(Evento evento, Integer idMateria) {
        Usuario usuarioLogado = getUsuarioLogado();

        Materia materia = materiaRepository.findById(idMateria)
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada!"));

        if (!materia.getUsuario().getIdUsuario().equals(usuarioLogado.getIdUsuario())) {
            throw new RuntimeException("Acesso negado: Esta matéria não pertence a você.");
        }

        evento.setMateria(materia);
        return eventoRepository.save(evento);
    }

    public List<Evento> listarEventosDaMateria(Integer idMateria) {
        Usuario usuarioLogado = getUsuarioLogado();

        Materia materia = materiaRepository.findById(idMateria)
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada!"));

        if (!materia.getUsuario().getIdUsuario().equals(usuarioLogado.getIdUsuario())) {
            throw new RuntimeException("Acesso negado: Esta matéria não pertence a você.");
        }

        return eventoRepository.findByMateria(materia);
    }


    public Evento atualizarEvento(Integer idEvento, Evento dadosAtualizados) {
        Usuario usuarioLogado = getUsuarioLogado();

        Evento eventoExistente = eventoRepository.findById(idEvento)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado!"));

        if (!eventoExistente.getMateria().getUsuario().getIdUsuario().equals(usuarioLogado.getIdUsuario())) {
            throw new RuntimeException("Acesso negado: Você não é o dono deste evento.");
        }

        eventoExistente.setHora(dadosAtualizados.getHora());
        eventoExistente.setSala(dadosAtualizados.getSala());
        eventoExistente.setBloco(dadosAtualizados.getBloco());

        return eventoRepository.save(eventoExistente);
    }

    public void deletarEvento(Integer idEvento) {
        Usuario usuarioLogado = getUsuarioLogado();

        Evento evento = eventoRepository.findById(idEvento)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado!"));

        if (!evento.getMateria().getUsuario().getIdUsuario().equals(usuarioLogado.getIdUsuario())) {
            throw new RuntimeException("Acesso negado: Este evento não pertence a você.");
        }

        eventoRepository.delete(evento);
    }

    private Usuario getUsuarioLogado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Nenhum usuário autenticado encontrado.");
        }
        return (Usuario) authentication.getPrincipal();
    }
}