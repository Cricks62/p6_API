const Sauces = require('../models/ModelSauce');

exports.createSauces = (req, res, next) => {
   const sauceObject = JSON.parse(req.body.sauces);
   delete sauceObject._id;
   delete sauceObject._userId;
   const sauces = new Sauces({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`
   });

   sauces.save()
    .then(() => {res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( {error})})
};

exports.modiftySauces = (req, res, next) => {
    Sauces.updateOne({_id: req.params.id}, {...req.body, _id: req.params.id})
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.deleteSauces = (req, res, next) => {
    Sauces.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(404).json({ error }));
};

exports.getOneSauces = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauces.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};

