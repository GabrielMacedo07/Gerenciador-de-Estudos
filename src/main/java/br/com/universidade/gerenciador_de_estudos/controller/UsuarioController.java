package br.com.universidade.gerenciador_de_estudos.controller;

import br.com.universidade.gerenciador_de_estudos.model.Usuario;
import br.com.universidade.gerenciador_de_estudos.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/usuarios")
public class UsuarioController {

    // A única dependência do Controller agora é o Service!
    @Autowired
    private UsuarioService service;

    @GetMapping
    public List<Usuario> listaUsuarios() {
        // Chama o método que criamos no Service
        return service.listarTodos();
    }

    @PostMapping
    public Usuario criarUsuario(@RequestBody Usuario usuario) {
        // CORRETO: Chama o service, que criptografa a senha
        return service.criarUsuario(usuario);
    }

    @PutMapping("/{idUsuario}")
    public ResponseEntity<Usuario> editarUsuario(@PathVariable Integer idUsuario, @RequestBody Usuario usuario) {
        // Chama a lógica de edição robusta do Service
        try {
            Usuario usuarioAtualizado = service.editarUsuario(idUsuario, usuario);
            // Retorna 200 OK com o usuário atualizado
            return ResponseEntity.ok(usuarioAtualizado);
        } catch (RuntimeException e) {
            // Se o service não encontrar o usuário, retorna 404 Not Found
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{idUsuario}")
    public ResponseEntity<Void> excluirUsuario(@PathVariable Integer idUsuario) {

        try {
            service.excluirUsuario(idUsuario); // Supondo que você criou o método no Service
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }
}