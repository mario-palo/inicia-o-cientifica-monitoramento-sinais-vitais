module.exports = function permissaoProfissional(req, res, next) {
  if (!['MEDICO', 'ENFERMEIRO'].includes(req.usuario.tipo)) {
    return res.status(403).json({ error: "Acesso negado" });
  }
  next();
};