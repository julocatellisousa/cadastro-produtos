const express = require('express');
const router = express.Router();

const { Produto, Categoria } = require('../models');

// Converte o valor do select de categoria ('' vira null)
function dadosProduto(body) {
  return {
    nome: body.nome,
    preco: body.preco,
    quantidade: body.quantidade === '' ? 0 : body.quantidade,
    categoriaId: body.categoriaId ? body.categoriaId : null
  };
}

// READ — listagem (já traz a categoria de cada produto)
router.get('/', async (req, res, next) => {
  try {
    const produtos = await Produto.findAll({
      include: { model: Categoria, as: 'categoria' },
      order: [['nome', 'ASC']]
    });
    res.render('produtos/index', { produtos });
  } catch (err) {
    next(err);
  }
});

// CREATE — formulário
router.get('/novo', async (req, res, next) => {
  try {
    const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] });
    res.render('produtos/novo', { categorias });
  } catch (err) {
    next(err);
  }
});

// CREATE — grava no banco
router.post('/', async (req, res, next) => {
  try {
    await Produto.create(dadosProduto(req.body));
    res.redirect('/produtos');
  } catch (err) {
    next(err);
  }
});

// UPDATE — formulário
router.get('/:id/editar', async (req, res, next) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) return res.redirect('/produtos');
    const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] });
    res.render('produtos/editar', { produto, categorias });
  } catch (err) {
    next(err);
  }
});

// UPDATE — grava no banco
router.post('/:id', async (req, res, next) => {
  try {
    await Produto.update(dadosProduto(req.body), {
      where: { id: req.params.id }
    });
    res.redirect('/produtos');
  } catch (err) {
    next(err);
  }
});

// DELETE
router.post('/:id/deletar', async (req, res, next) => {
  try {
    await Produto.destroy({ where: { id: req.params.id } });
    res.redirect('/produtos');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
