const Sauces = require('../models/ModelSauce');
const fs = require('fs');

exports.createSauces = (req, res, next) => {
   const sauceObject = JSON.parse(req.body.sauce);
   delete sauceObject._id;
   delete sauceObject._userId;
   const sauces = new Sauces({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   });

   sauces.save()
    .then(() => {res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( {error})})
};

exports.modiftySauces = (req, res, next) => {
    const saucesObject = req.file ? {
      ...JSON.parse(req.body.sauces),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete saucesObject._userId;
    Sauces.findOne({_id: req.params.id})
      .then((sauces) => {
        if ( sauces.userId != req.auth.userId) {
          res.status(401).json({ message: 'Non-autorisé'})
        } else {
          Sauces.updateOne({ _id: req.params.id}, { ...saucesObject, _id: req.params.id})
            .then(() => res.status(200).json({message: 'Objet modifié'}))
            .catch(error => res.status(401).json({ error }));
        }
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
};

exports.deleteSauces = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id})
      .then(sauces => {
        if (sauces.userId != req.auth.userId) {
          res.status(401).json({message: 'Non-autorisé' });
        } else {
          const filename = sauces.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            Sauces.deleteOne({_id: req.params.id})
              .then(() => { res.status(200).json({message: 'Objet supprimé!'})})
              .catch(error => res.status(401).json({ error }));
          });
        }
      })
      .catch( error => {
        res.status(500).json({ error });
      });
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

exports.likeDislike = (req, res, next) => {
  const like = req.body.like;
  if (like === 1) {
    // code pour ajouter un like
    Sauces.updateOne({ _id: req.params.id },{ $inc: { likes: +1 }, $push: { usersLiked: req.body.userId }})
      .then(() => {
        res.status(201).json({ message: 'Vous aimer la sauce'})
      })
      .catch((error) => res.status(400).json( error ));
  } else if (like === -1) {
    // code pour ajouter un dislike
    Sauces.updateOne({ _id:req.params.id }, {$inc: {dislikes: +1}, $push: { usersDisliked: req.body.userId }})
      .then(() => {
        res.status(201).json({message: "Vous n'aimer pas la sauce"})
      })
      .catch((error) => res.status(400).json( error ));
    } else if (like === 0) {
      Sauces.findOne({ _id: req.params.id, usersLiked: req.body.userId })
        .then(sauce => {
          if (sauce) {
            // Si l'utilisateur a aimé la sauce, on décrémente les likes et on supprime l'utilisateur de la liste des utilisateurs qui ont aimé la sauce
            Sauces.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } })
              .then(() => {
                res.status(201).json({ message: 'Like supprimé' });
              })
              .catch((error) => res.status(400).json(error));
          } else {
            // si l'utilisateur n'a pas aimé la sauce, on décrémente les dislikes et on supprime l'utilisateur de la liste des utilisateurs qui n'ont pas aimé la sauce
            Sauces.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } })
              .then(() => {
                res.status(201).json({ message: 'Dislike supprimé' });
              })
              .catch((error) => res.status(400).json(error));
          }
        })
        .catch((error) => {
          res.status(400).json( error );
        });
    }
  };