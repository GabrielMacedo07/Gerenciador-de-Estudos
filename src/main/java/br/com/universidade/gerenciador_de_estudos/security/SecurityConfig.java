package br.com.universidade.gerenciador_de_estudos.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Desabilita o CSRF, comum para APIs stateless
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/usuarios").permitAll() // PERMITE acesso público ao endpoint /usuarios
                        .anyRequest().authenticated() // EXIGE autenticação para qualquer outra requisição
                );
        return http.build();
    }
}