package br.com.universidade.gerenciador_de_estudos.controller;

import br.com.universidade.gerenciador_de_estudos.dto.LoginRequestDTO;
import br.com.universidade.gerenciador_de_estudos.dto.UsuarioResponseDTO;
import br.com.universidade.gerenciador_de_estudos.model.Usuario;
import br.com.universidade.gerenciador_de_estudos.service.TokenService;
import br.com.universidade.gerenciador_de_estudos.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private TokenService tokenService;


    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO data) {
        try {

            Usuario usuarioAutenticado = usuarioService.autenticar(data);
            var token = tokenService.gerarToken(usuarioAutenticado);

            UsuarioResponseDTO usuarioDTO = new UsuarioResponseDTO(
                    usuarioAutenticado.getIdUsuario(),
                    usuarioAutenticado.getNome(),
                    usuarioAutenticado.getEmail(),
                    usuarioAutenticado.getCurso(),
                    usuarioAutenticado.getPeriodoAtual(),
                    usuarioAutenticado.getIdade()
            );


            return ResponseEntity.ok(Map.of("token", token, "usuario", usuarioDTO));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("erro", "Email ou senha inválidos"));
        }
    }
}