package br.com.universidade.gerenciador_de_estudos.service;

import br.com.universidade.gerenciador_de_estudos.model.Materia;
import br.com.universidade.gerenciador_de_estudos.model.Tarefa;
import br.com.universidade.gerenciador_de_estudos.model.Usuario;
import br.com.universidade.gerenciador_de_estudos.repository.MateriaRepository;
import br.com.universidade.gerenciador_de_estudos.repository.TarefaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TarefaService {

    @Autowired
    private TarefaRepository tarefaRepository;

    @Autowired
    private MateriaRepository materiaRepository; // Para verificar o dono da matéria

    public Tarefa criarTarefa(Tarefa tarefa, Integer idMateria) {
        Usuario usuarioLogado = getUsuarioLogado();

        Materia materia = materiaRepository.findById(idMateria)
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada!"));

        if (!materia.getUsuario().getIdUsuario().equals(usuarioLogado.getIdUsuario())) {
            throw new RuntimeException("Acesso negado: Esta matéria não pertence a você.");
        }

        tarefa.setMateria(materia);
        return tarefaRepository.save(tarefa);
    }


    public List<Tarefa> listarTarefasDaMateria(Integer idMateria) {
        Usuario usuarioLogado = getUsuarioLogado();

        Materia materia = materiaRepository.findById(idMateria)
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada!"));

        if (!materia.getUsuario().getIdUsuario().equals(usuarioLogado.getIdUsuario())) {
            throw new RuntimeException("Acesso negado: Esta matéria não pertence a você.");
        }

        return tarefaRepository.findByMateria(materia);
    }


    public Tarefa atualizarTarefa(Integer idTarefa, Tarefa dadosAtualizados) {
        Usuario usuarioLogado = getUsuarioLogado();

        Tarefa tarefaExistente = tarefaRepository.findById(idTarefa)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada!"));

        if (!tarefaExistente.getMateria().getUsuario().getIdUsuario().equals(usuarioLogado.getIdUsuario())) {
            throw new RuntimeException("Acesso negado: Você não é o dono desta tarefa.");
        }

        tarefaExistente.setTema(dadosAtualizados.getTema());
        tarefaExistente.setDescricao(dadosAtualizados.getDescricao());
        tarefaExistente.setDataEntrega(dadosAtualizados.getDataEntrega());
        return tarefaRepository.save(tarefaExistente);
    }


    public void deletarTarefa(Integer idTarefa) {
        Usuario usuarioLogado = getUsuarioLogado();

        Tarefa tarefa = tarefaRepository.findById(idTarefa)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada!"));

        if (!tarefa.getMateria().getUsuario().getIdUsuario().equals(usuarioLogado.getIdUsuario())) {
            throw new RuntimeException("Acesso negado: Esta tarefa não pertence a você.");
        }

        tarefaRepository.delete(tarefa);
    }


    private Usuario getUsuarioLogado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Nenhum usuário autenticado encontrado.");
        }
        return (Usuario) authentication.getPrincipal();
    }
}