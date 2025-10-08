package br.com.universidade.gerenciador_de_estudos.controller;

import br.com.universidade.gerenciador_de_estudos.dto.LoginRequestDTO;
import br.com.universidade.gerenciador_de_estudos.dto.LoginResponseDTO;
import br.com.universidade.gerenciador_de_estudos.model.Usuario;
import br.com.universidade.gerenciador_de_estudos.service.TokenService;
import br.com.universidade.gerenciador_de_estudos.service.UsuarioService; // 1. Importe o UsuarioService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    // 2. Remova o AuthenticationManager e injete o UsuarioService
    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO data) {
        try {
            // 3. Chame nosso método de autenticação manual do service
            Usuario usuarioAutenticado = usuarioService.autenticar(data);

            // 4. Se a autenticação deu certo, gere o token
            var token = tokenService.gerarToken(usuarioAutenticado);

            // 5. Retorne o token com status 200 OK
            return ResponseEntity.ok(new LoginResponseDTO(token));

        } catch (RuntimeException e) {
            // 6. Se o service lançou uma exceção (usuário/senha inválidos), retorne 403
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}