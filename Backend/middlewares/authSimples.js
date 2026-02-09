let usuarioLogado = null;

module.exports = {
  login(usuario) {
    usuarioLogado = usuario;
  },

  logout() {
    usuarioLogado = null;
  },

  auth(req, res, next) {
    if (!usuarioLogado) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    req.usuario = usuarioLogado;
    next();
  }
};