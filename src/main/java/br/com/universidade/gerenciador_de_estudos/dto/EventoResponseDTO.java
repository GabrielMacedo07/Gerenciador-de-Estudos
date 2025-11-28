package br.com.universidade.gerenciador_de_estudos.dto;

import java.time.LocalTime;

public record EventoResponseDTO(
        Integer idEvento,
        LocalTime hora,
        String sala,
        String bloco,
        Integer idMateria // Trazemos apenas o ID, cortando a busca desnecessária
) {}