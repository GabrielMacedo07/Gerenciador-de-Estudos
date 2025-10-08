package br.com.universidade.gerenciador_de_estudos.repository;

import br.com.universidade.gerenciador_de_estudos.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional; // 1. Adicione este import

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByEmail(String email);

}