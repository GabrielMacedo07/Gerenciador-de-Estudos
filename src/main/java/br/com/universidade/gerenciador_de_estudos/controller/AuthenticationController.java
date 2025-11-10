package br.com.universidade.gerenciador_de_estudos.controller;

// 1. Adicione os imports que faltam
import br.com.universidade.gerenciador_de_estudos.dto.LoginRequestDTO;
import br.com.universidade.gerenciador_de_estudos.dto.UsuarioResponseDTO; // <-- IMPORTANTE
import br.com.universidade.gerenciador_de_estudos.model.Usuario;
import br.com.universidade.gerenciador_de_estudos.service.TokenService;
import br.com.universidade.gerenciador_de_estudos.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; // <-- IMPORTANTE
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map; // <-- IMPORTANTE

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private TokenService tokenService;

    // 2. Mude o tipo de retorno para 'ResponseEntity<?>' (genérico)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO data) {
        try {
            // Esta parte estava correta
            Usuario usuarioAutenticado = usuarioService.autenticar(data);
            var token = tokenService.gerarToken(usuarioAutenticado);

            // 3. Crie o DTO do usuário (para não enviar a senha)
            // (Assumindo que seu DTO tem este construtor)
            UsuarioResponseDTO usuarioDTO = new UsuarioResponseDTO(
                    usuarioAutenticado.getIdUsuario(),
                    usuarioAutenticado.getNome(),
                    usuarioAutenticado.getEmail(),
                    usuarioAutenticado.getCurso(),
                    usuarioAutenticado.getPeriodoAtual(),
                    usuarioAutenticado.getIdade()
            );

            // 4. Retorne um Mapa (JSON) contendo AMBOS os objetos
            // O frontend vai receber: { "token": "...", "usuario": {...} }
            return ResponseEntity.ok(Map.of("token", token, "usuario", usuarioDTO));

        } catch (RuntimeException e) {
            // Se a autenticação falhar (usuário/senha errados)
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}