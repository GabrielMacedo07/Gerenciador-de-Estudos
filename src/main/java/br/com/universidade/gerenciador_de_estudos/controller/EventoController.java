package br.com.universidade.gerenciador_de_estudos.controller;

import br.com.universidade.gerenciador_de_estudos.model.Evento;
import br.com.universidade.gerenciador_de_estudos.service.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:8081")
public class EventoController { // Define os endpoints de Evento

    @Autowired
    private EventoService eventoService;

    @PostMapping("/materias/{idMateria}/eventos")
    public ResponseEntity<?> criarEvento(
            @PathVariable Integer idMateria,
            @RequestBody Evento evento) {
        try {
            Evento novoEvento = eventoService.criarEvento(evento, idMateria);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoEvento);
        } catch (RuntimeException e) {
            // Trata erros de "Não encontrado" ou "Acesso negado"
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }


    @GetMapping("/materias/{idMateria}/eventos")
    public ResponseEntity<?> listarEventosDaMateria(@PathVariable Integer idMateria) {
        try {
            List<Evento> eventos = eventoService.listarEventosDaMateria(idMateria);
            return ResponseEntity.ok(eventos);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @PutMapping("/eventos/{idEvento}")
    public ResponseEntity<?> atualizarEvento(
            @PathVariable Integer idEvento,
            @RequestBody Evento dadosAtualizados) {
        try {
            Evento eventoAtualizado = eventoService.atualizarEvento(idEvento, dadosAtualizados);
            return ResponseEntity.ok(eventoAtualizado);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Acesso negado")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


    @DeleteMapping("/eventos/{idEvento}")
    public ResponseEntity<?> deletarEvento(@PathVariable Integer idEvento) {
        try {
            eventoService.deletarEvento(idEvento);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Acesso negado")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}