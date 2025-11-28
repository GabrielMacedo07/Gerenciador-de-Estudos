package br.com.universidade.gerenciador_de_estudos.controller;

import br.com.universidade.gerenciador_de_estudos.dto.EventoResponseDTO;
import br.com.universidade.gerenciador_de_estudos.model.Evento;
import br.com.universidade.gerenciador_de_estudos.service.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@CrossOrigin("*")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    // --- CRIAR (POST) COM DTO ---
    @PostMapping("/materias/{idMateria}/eventos")
    public ResponseEntity<?> criarEvento(
            @PathVariable Integer idMateria,
            @RequestBody Evento evento) {
        try {
            // 1. Cria o evento normalmente
            Evento novoEvento = eventoService.criarEvento(evento, idMateria);

            // 2. CONVERTE PARA DTO (Isso evita os selects extras!)
            EventoResponseDTO dto = new EventoResponseDTO(
                    novoEvento.getIdEvento(),
                    novoEvento.getHora(),
                    novoEvento.getSala(),
                    novoEvento.getBloco(),
                    novoEvento.getMateria().getIdMateria() // Só o ID
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    // --- LISTAR (GET) COM DTO ---
    @GetMapping("/materias/{idMateria}/eventos")
    public ResponseEntity<?> listarEventosDaMateria(@PathVariable Integer idMateria) {
        try {
            List<Evento> eventos = eventoService.listarEventosDaMateria(idMateria);

            // Converte a lista de Entidades para lista de DTOs
            List<EventoResponseDTO> dtos = eventos.stream().map(evt -> new EventoResponseDTO(
                    evt.getIdEvento(),
                    evt.getHora(),
                    evt.getSala(),
                    evt.getBloco(),
                    evt.getMateria().getIdMateria()
            )).collect(Collectors.toList());

            return ResponseEntity.ok(dtos);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    // --- ATUALIZAR (PUT) COM DTO ---
    @PutMapping("/eventos/{idEvento}")
    public ResponseEntity<?> atualizarEvento(
            @PathVariable Integer idEvento,
            @RequestBody Evento dadosAtualizados) {
        try {
            Evento eventoAtualizado = eventoService.atualizarEvento(idEvento, dadosAtualizados);

            EventoResponseDTO dto = new EventoResponseDTO(
                    eventoAtualizado.getIdEvento(),
                    eventoAtualizado.getHora(),
                    eventoAtualizado.getSala(),
                    eventoAtualizado.getBloco(),
                    eventoAtualizado.getMateria().getIdMateria()
            );

            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            // ... tratamento de erro igual ...
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }}