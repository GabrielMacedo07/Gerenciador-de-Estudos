package br.com.universidade.gerenciador_de_estudos.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record FormularioDTO(
        @NotBlank(message = "Nome é obrigatório")
        String nome,
        
        @NotBlank(message = "Curso é obrigatório")
        String curso,
        
        @NotBlank(message = "Período atual é obrigatório")
        String periodoAtual,
        
        @NotNull(message = "Idade é obrigatória")
        @Min(value = 1, message = "Idade deve ser maior que 0")
        Integer idade
) {}
