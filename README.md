# Qwen3-4B-FineTuning
Le fine tuning de Qwen3 pour la generation du texte (question - reponse) en Darija, optimise avec unsloth avec une configuration de LoRA avec un rang egal a 4.
L'entrainement est fait avec SFTTrainer pour un fine tuning supervise.
L'evaluation du modele avec differents metriques d'evaluation comme les metriques BERTScore, BLEU, ROUGE.
La base de donnees d'entrainement est une base de question reponse en Darija, bien nettoye et formate pour l'utilisation direct dans le model.
Voila le lien vers la base de donnees : https://huggingface.co/datasets/AbdelilahFdg/QA
