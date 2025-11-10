package br.com.universidade.gerenciador_de_estudos.dto;

public record UsuarioResponseDTO(
        Integer idUsuario,
        String nome,
        String email,
        String curso,
        String periodoAtual,
        Integer idade // Usamos Integer para aceitar o valor 'null'
) {
}