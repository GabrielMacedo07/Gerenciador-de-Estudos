package br.com.universidade.gerenciador_de_estudos.controller;

import br.com.universidade.gerenciador_de_estudos.model.Materia;
import br.com.universidade.gerenciador_de_estudos.service.MateriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/materias") // Todos os endpoints aqui começarão com /materias
@CrossOrigin("*")
public class MateriaController {

    @Autowired
    private MateriaService materiaService;

    /**
     * Endpoint para CRIAR uma nova matéria.
     * O Service se encarregará de associá-la ao usuário logado.
     * Rota: POST /materias
     */
    @PostMapping
    public ResponseEntity<Materia> criarMateria(@RequestBody Materia materia) {
        Materia novaMateria = materiaService.criarMateria(materia);
        // Retorna 201 Created com a matéria recém-criada no corpo
        return ResponseEntity.status(HttpStatus.CREATED).body(novaMateria);
    }

    /**
     * Endpoint para LISTAR todas as matérias do usuário logado.
     * Rota: GET /materias
     */
    @GetMapping
    public ResponseEntity<List<Materia>> listarMinhasMaterias() {
        List<Materia> materias = materiaService.listarMateriasDoUsuarioLogado();
        return ResponseEntity.ok(materias);
    }

    /**
     * Endpoint para ATUALIZAR uma matéria existente.
     * Rota: PUT /materias/{idMateria}
     */
    @PutMapping("/{idMateria}")
    public ResponseEntity<?> atualizarMateria(@PathVariable Integer idMateria, @RequestBody Materia dadosAtualizados) {
        try {
            Materia materiaAtualizada = materiaService.atualizarMateria(idMateria, dadosAtualizados);
            return ResponseEntity.ok(materiaAtualizada);
        } catch (RuntimeException e) {
            // Trata os erros de "Não encontrado" ou "Acesso negado" vindos do Service
            if (e.getMessage().contains("Acesso negado")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Endpoint para DELETAR uma matéria existente.
     * Rota: DELETE /materias/{idMateria}
     */
    @DeleteMapping("/{idMateria}")
    public ResponseEntity<?> deletarMateria(@PathVariable Integer idMateria) {
        try {
            materiaService.deletarMateria(idMateria);
            return ResponseEntity.noContent().build(); // Retorna 204 No Content (sucesso sem corpo)
        } catch (RuntimeException e) {
            // Trata os erros de "Não encontrado" ou "Acesso negado" vindos do Service
            if (e.getMessage().contains("Acesso negado")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}