package br.com.universidade.gerenciador_de_estudos.controller;

import br.com.universidade.gerenciador_de_estudos.dto.EstatisticaNotaDTO;
import br.com.universidade.gerenciador_de_estudos.service.EstatisticaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/estatisticas") // Nova rota base para estatísticas
@CrossOrigin(origins = "http://localhost:8081")
public class EstatisticaController {

    @Autowired
    private EstatisticaService estatisticaService;

    @GetMapping("/media-por-materia")
    public ResponseEntity<List<EstatisticaNotaDTO>> getMediaPorMateria() {

        List<EstatisticaNotaDTO> dadosDoGrafico = estatisticaService.getMediaNotasPorMateria();
        return ResponseEntity.ok(dadosDoGrafico);
    }
}