# 25.03.2026 : Step by step 

## Comment lancer le front-end du Pool sur son local

1. Cloner le repository Github 

```
git clone https://github.com/headpoolnumerique/pool-website-front.git
git checkout main
```

2. Ajouter dans le root folder le fichier `.env.local` trouvable dans le Teams privé du Pool
3. S'assure que `node v18.20.8` est installé. Si non:

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 18.20.8
```

4. Installer les dépendances du package json (`npm install --save`)
5. Ajouter dans le dossier `\styles` la fonte `Hermes-Regular`, format `.woff2`
6. Commenter le `output: "export",` dans le `next.config.mjs`
6. Lancer la commande `npm run dev`


## Comment mettre en ligne une nouvell version du front-end

1. Décommenter le `output: "export",` dans le `next.config.mjs`
2. Lancer la commande `npm run build`
3. Mettre le contenu du fichier `/out`sur le serveur Infomaniak, de préférence en utilisant la méthode `rsync`: 

```
rsync -avz --delete ./out/ [identifiant ssh]:~/sites/head-digital-pool.ch
```

4. Ne pas oublier de pousser la nouvelle version du code dans le Github commun:

```
git add.
Git commit -m "[Nature du changement ici]"
Git push origin main

```

