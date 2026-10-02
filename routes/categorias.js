const express = require('express');
const router = express.Router();

const { Categoria, Produto } = require('../models');

// Listagem de categorias
router.get('/', async (req, res, next) => {
  try {
    const categorias = await Categoria.findAll({
      include: { model: Produto, as: 'produtos', attributes: ['id'] },
      order: [['nome', 'ASC']]
    });
    res.render('categorias/index', { categorias, erro: null });
  } catch (err) {
    next(err);
  }
});

// Cadastro de categoria
router.post('/', async (req, res, next) => {
  try {
    const nome = (req.body.nome || '').trim();
    if (!nome) {
      throw new Error('O nome da categoria é obrigatório.');
    }
    await Categoria.create({ nome });
    res.redirect('/categorias');
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError' || err.message.includes('obrigatório')) {
      const categorias = await Categoria.findAll({
        include: { model: Produto, as: 'produtos', attributes: ['id'] },
        order: [['nome', 'ASC']]
      });
      const erro = err.name === 'SequelizeUniqueConstraintError'
        ? 'Já existe uma categoria com esse nome.'
        : err.message;
      return res.status(400).render('categorias/index', { categorias, erro });
    }
    next(err);
  }
});

module.exports = router;
