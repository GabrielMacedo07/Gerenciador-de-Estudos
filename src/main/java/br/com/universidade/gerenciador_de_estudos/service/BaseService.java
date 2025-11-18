package br.com.universidade.gerenciador_de_estudos.service;

import br.com.universidade.gerenciador_de_estudos.model.Usuario;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Classe base para services que precisam acessar o usuário logado
 */
public abstract class BaseService {

    /**
     * Retorna o usuário autenticado no contexto de segurança atual
     * @return Usuario logado
     * @throws RuntimeException se não houver usuário autenticado
     */
    protected Usuario getUsuarioLogado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Nenhum usuário autenticado encontrado.");
        }
        return (Usuario) authentication.getPrincipal();
    }
}
