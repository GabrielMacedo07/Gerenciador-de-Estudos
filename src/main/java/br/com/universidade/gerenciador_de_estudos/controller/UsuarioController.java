package br.com.universidade.gerenciador_de_estudos.controller;

import br.com.universidade.gerenciador_de_estudos.dto.FormularioDTO;
import br.com.universidade.gerenciador_de_estudos.model.Usuario;
import br.com.universidade.gerenciador_de_estudos.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/usuarios")
public class UsuarioController {

    // A única dependência do Controller agora é o Service!
    @Autowired
    private UsuarioService service;

    @GetMapping
    public ResponseEntity<?> listaUsuarios() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Endpoint desabilitado por segurança. Use endpoints específicos.");
    }

    @PostMapping
    public Usuario criarUsuario(@RequestBody Usuario usuario) {
        return service.criarUsuario(usuario);
    }

    @PutMapping("/{idUsuario}")
    public ResponseEntity<Usuario> editarUsuario(@PathVariable Integer idUsuario, @RequestBody Usuario usuario) {
        try {
            Usuario usuarioAtualizado = service.editarUsuario(idUsuario, usuario);
            return ResponseEntity.ok(usuarioAtualizado);
        } catch (RuntimeException e) {
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
    @PatchMapping("/completar-perfil")
    public ResponseEntity<Usuario> completarPerfil(@RequestBody FormularioDTO dados) {
        try {
            Usuario usuarioAtualizado = service.completarCadastro(dados);
            return ResponseEntity.ok(usuarioAtualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}