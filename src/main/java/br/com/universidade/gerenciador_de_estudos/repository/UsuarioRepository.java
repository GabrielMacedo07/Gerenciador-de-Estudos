package br.com.universidade.gerenciador_de_estudos.repository;

import org.springframework.data.repository.CrudRepository;
import br.com.universidade.gerenciador_de_estudos.model.Usuario;


public interface UsuarioRepository extends CrudRepository<Usuario , Integer> {
}
