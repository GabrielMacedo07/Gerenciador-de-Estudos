package br.com.universidade.gerenciador_de_estudos.service;

import br.com.universidade.gerenciador_de_estudos.model.Usuario;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    // Injeta o valor da nossa propriedade customizada (o segredo do token)
    @Value("${api.security.token.secret}")
    private String secret;

    public String gerarToken(Usuario usuario) {
        try {
            // Define o algoritmo de assinatura usando o nosso segredo
            Algorithm algorithm = Algorithm.HMAC256(secret);
            String token = JWT.create()
                    .withIssuer("gerenciador-de-estudos-api") // Identifica quem emitiu o token
                    .withSubject(usuario.getEmail()) // Identifica o "dono" do token (o usuário)
                    .withExpiresAt(gerarDataDeExpiracao()) // Define o tempo de expiração
                    .sign(algorithm); // Assina o token
            return token;
        } catch (JWTCreationException exception){
            throw new RuntimeException("Erro ao gerar token JWT", exception);
        }
    }

    // Método para validar o token (usaremos mais tarde no filtro de segurança)
    public String validarToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("gerenciador-de-estudos-api")
                    .build()
                    .verify(token)
                    .getSubject(); // Retorna o email do usuário se o token for válido
        } catch (Exception exception) {
            return ""; // Retorna vazio se o token for inválido
        }
    }

    private Instant gerarDataDeExpiracao() {
        // Define que o token vai expirar em 2 horas a partir do momento atual
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}