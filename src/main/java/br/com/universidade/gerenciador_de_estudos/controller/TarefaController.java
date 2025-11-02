package br.com.universidade.gerenciador_de_estudos.controller;

import br.com.universidade.gerenciador_de_estudos.model.Tarefa;
import br.com.universidade.gerenciador_de_estudos.service.TarefaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/materias") // A rota base ainda é /materias
@CrossOrigin("*")
public class TarefaController {

    @Autowired
    private TarefaService tarefaService;

    @PostMapping("/{idMateria}/tarefas")
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

    @GetMapping("/{idMateria}/tarefas")
    public ResponseEntity<?> listarTarefasDaMateria(@PathVariable Integer idMateria) {
        try {
            List<Tarefa> tarefas = tarefaService.listarTarefasDaMateria(idMateria);
            return ResponseEntity.ok(tarefas);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @DeleteMapping("/tarefas/{idTarefa}")
    public ResponseEntity<?> deletarTarefa(@PathVariable Integer idTarefa) {
        try {
            tarefaService.deletarTarefa(idTarefa);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    // Você pode adicionar um @PutMapping("/tarefas/{idTarefa}") para atualizar uma tarefa no futuro
}