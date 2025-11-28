package br.com.universidade.gerenciador_de_estudos.dto;

import java.time.LocalDate;

public record TarefaResponseDTO(
        Integer idTarefa,
        String tema,
        String descricao,
        LocalDate dataEntrega,
        boolean concluida,
        Integer idMateria // Retornamos apenas o ID, não o objeto Materia inteiro
) {}