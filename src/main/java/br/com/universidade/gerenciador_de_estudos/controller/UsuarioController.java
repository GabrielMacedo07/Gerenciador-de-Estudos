package br.com.universidade.gerenciador_de_estudos.controller;

import br.com.universidade.gerenciador_de_estudos.model.Usuario;
import br.com.universidade.gerenciador_de_estudos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    @GetMapping
    public List<Usuario> listaUsuarios () {
        return (List<Usuario>)repository.findAll();
    }

    @PostMapping
    public Usuario criarUsuario(@RequestBody Usuario usuario) {
        Usuario usuarioNovo = repository.save(usuario);
        return usuarioNovo;
    }

    @PutMapping
    public Usuario editarUsuario(@RequestBody Usuario usuario) {
        Usuario usuarioNovo = repository.save(usuario);
        return usuarioNovo;
    }

    @DeleteMapping("/{idUsuario}")
    public ResponseEntity<Void> excluirUsuario(@PathVariable Integer idUsuario) {
        // Primeiro, verifica se o usuário realmente existe no banco
        if (!repository.existsById(idUsuario)) {
            // Se não existir, retorna um status 404 Not Found
            return ResponseEntity.notFound().build();
        }

        // Se existir, deleta o usuário
        repository.deleteById(idUsuario);

        // Retorna um status 204 No Content, indicando sucesso na exclusão
        return ResponseEntity.noContent().build();
    }

}
