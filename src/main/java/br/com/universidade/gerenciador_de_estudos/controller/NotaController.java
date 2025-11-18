package br.com.universidade.gerenciador_de_estudos.controller;

import br.com.universidade.gerenciador_de_estudos.model.Nota;
import br.com.universidade.gerenciador_de_estudos.service.NotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:8081")
public class NotaController {

    @Autowired
    private NotaService notaService;

    @PostMapping("/materias/{idMateria}/notas")
    public ResponseEntity<?> criarNota(
            @PathVariable Integer idMateria,
            @RequestBody Nota nota) {
        try {
            Nota novaNota = notaService.criarNota(nota, idMateria);
            return ResponseEntity.status(HttpStatus.CREATED).body(novaNota);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @GetMapping("/materias/{idMateria}/notas")
    public ResponseEntity<?> listarNotasDaMateria(@PathVariable Integer idMateria) {
        try {
            List<Nota> notas = notaService.listarNotasDaMateria(idMateria);
            return ResponseEntity.ok(notas);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @PutMapping("/notas/{idNota}")
    public ResponseEntity<?> atualizarNota(
            @PathVariable Integer idNota,
            @RequestBody Nota dadosAtualizados) {
        try {
            Nota notaAtualizada = notaService.atualizarNota(idNota, dadosAtualizados);
            return ResponseEntity.ok(notaAtualizada);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Acesso negado")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/notas/{idNota}")
    public ResponseEntity<?> deletarNota(@PathVariable Integer idNota) {
        try {
            notaService.deletarNota(idNota);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Acesso negado")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}