package br.com.universidade.gerenciador_de_estudos.service;

import br.com.universidade.gerenciador_de_estudos.dto.FormularioDTO;
import br.com.universidade.gerenciador_de_estudos.dto.LoginRequestDTO; // Verifique se você tem este DTO criado
import br.com.universidade.gerenciador_de_estudos.model.Usuario;
import br.com.universidade.gerenciador_de_estudos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UsuarioService extends BaseService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario criarUsuario(Usuario usuario) {
        String senhaCriptografada = passwordEncoder.encode(usuario.getSenha());
        usuario.setSenha(senhaCriptografada);
        return usuarioRepository.save(usuario);
    }
    public Usuario completarCadastro(FormularioDTO dados) {
        Usuario usuarioLogado = getUsuarioLogado();
        usuarioLogado.setNome(dados.nome());
        usuarioLogado.setCurso(dados.curso());
        usuarioLogado.setPeriodoAtual(dados.periodoAtual());
        usuarioLogado.setIdade(dados.idade());
        return usuarioRepository.save(usuarioLogado);
    }

    public Usuario editarUsuario(Integer idUsuario, Usuario dadosAtualizados) {
        Usuario usuarioExistente = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com o id: " + idUsuario));

        usuarioExistente.setNome(dadosAtualizados.getNome());
        usuarioExistente.setCurso(dadosAtualizados.getCurso());
        usuarioExistente.setPeriodoAtual(dadosAtualizados.getPeriodoAtual());
        usuarioExistente.setEmail(dadosAtualizados.getEmail());

        if (dadosAtualizados.getSenha() != null && !dadosAtualizados.getSenha().isEmpty()) {
            String senhaCriptografada = passwordEncoder.encode(dadosAtualizados.getSenha());
            usuarioExistente.setSenha(senhaCriptografada);
        }
        return usuarioRepository.save(usuarioExistente);
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public void excluirUsuario(Integer idUsuario) {
        if (!usuarioRepository.existsById(idUsuario)) {
            throw new RuntimeException("Usuário não encontrado com o id: " + idUsuario);
        }
        usuarioRepository.deleteById(idUsuario);
    }

    // --- NOVO MÉTODO DE AUTENTICAÇÃO MANUAL ---

    public Usuario autenticar(LoginRequestDTO dadosLogin) {
        // 1. Busca o usuário no banco pelo email.
        Usuario usuario = usuarioRepository.findByEmail(dadosLogin.email())
                .orElseThrow(() -> new RuntimeException("Usuário ou senha inválidos."));

        // 2. Compara a senha da requisição com a senha criptografada no banco.
        if (passwordEncoder.matches(dadosLogin.senha(), usuario.getSenha())) {
            // 3. Se as senhas baterem, retorna o usuário.
            return usuario;
        }

        // 4. Se as senhas não baterem, lança uma exceção.
        throw new RuntimeException("Usuário ou senha inválidos.");
    }
}