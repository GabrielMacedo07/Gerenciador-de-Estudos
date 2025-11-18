package br.com.universidade.gerenciador_de_estudos.controller;

import br.com.universidade.gerenciador_de_estudos.model.Tarefa;
import br.com.universidade.gerenciador_de_estudos.service.TarefaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("*")
public class TarefaController {

    @Autowired
    private TarefaService tarefaService;

    @PostMapping("/materias/{idMateria}/tarefas")
    public ResponseEntity<?> criarTarefa(
            @PathVariable Integer idMateria,
            @RequestBody Tarefa tarefa) {
        try {
            Tarefa novaTarefa = tarefaService.criarTarefa(tarefa, idMateria);
            return ResponseEntity.status(HttpStatus.CREATED).body(novaTarefa);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }


    @GetMapping("/materias/{idMateria}/tarefas")
    public ResponseEntity<?> listarTarefasDaMateria(@PathVariable Integer idMateria) {
        try {
            List<Tarefa> tarefas = tarefaService.listarTarefasDaMateria(idMateria);
            return ResponseEntity.ok(tarefas);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @PutMapping("/tarefas/{idTarefa}")
    public ResponseEntity<?> atualizarTarefa(
            @PathVariable Integer idTarefa,
            @RequestBody Tarefa dadosAtualizados) {
        try {
            Tarefa tarefaAtualizada = tarefaService.atualizarTarefa(idTarefa, dadosAtualizados);
            return ResponseEntity.ok(tarefaAtualizada);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Acesso negado")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


    @DeleteMapping("/tarefas/{idTarefa}")
    public ResponseEntity<?> deletarTarefa(@PathVariable Integer idTarefa) {
        try {
            tarefaService.deletarTarefa(idTarefa);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Acesso negado")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PatchMapping("/tarefas/{idTarefa}/status")
    public ResponseEntity<?> atualizarStatusTarefa(
            @PathVariable Integer idTarefa,
            @RequestBody Map<String, Boolean> payload) {
        try {
            Boolean concluida = payload.get("concluida");
            if (concluida == null) {
                return ResponseEntity.badRequest().body("Campo 'concluida' é obrigatório");
            }
            
            Tarefa tarefaAtualizada = tarefaService.atualizarStatusTarefa(idTarefa, concluida);
            return ResponseEntity.ok(tarefaAtualizada);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Acesso negado")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}