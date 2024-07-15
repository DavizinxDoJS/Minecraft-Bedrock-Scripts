import { world, system } from "@minecraft/server";
import * as db from "./database.js";

world.beforeEvents.chatSend.subscribe(ev => {
    const player = ev.sender;
    const msg = ev.message;
    const args = msg.split(" ");

    if (args[0] == "!gift" || args[0] == "!presente") {
        ev.cancel = true;

        if (args[1] == "redeem" || args[1] == "resgatar") {
            const gift = db.getV("gifts", args[2]);
            if (gift) {
                player.runCommandAsync(gift.command);
                player.sendMessage(
                    `§aVocê resgatou o presente §f"§r${gift.name}§r§f" §acom sucesso!`
                );

                // Checa se deletePosUse é verdadeiro e remove o gift se for
                if (gift.deletePosUse) {
                    db.remove("gifts", args[2]);
                }
            } else {
                player.sendMessage("§cCódigo de presente inválido!");
            }
        }

        if (args[1] == "create" || args[1] == "criar") {
            if (!args[2] || !args[3] || !args[4] || !args[5]) {
                return player.sendMessage(
                    "§cVocê precisa preencher todos os campos. §fEx: !gift create <nome> <código de resgate> <deleta após usar true/false> <comando de execução>"
                );
            }

            const deletePosUse = args[4].toLowerCase() === "true";
            const giftI = {
                name: args[2],
                code: args[3],
                deletePosUse: deletePosUse,
                command: args.slice(5).join(" ") // Para suportar comandos com espaços
            };

            const gifts = db.get("gifts");
            gifts[giftI.code] = giftI;
            db.set("gifts", gifts);
            player.sendMessage(
                `§aPresente §f"§r${args[2]}§r" §acriado com sucesso!`
            );
        }

        if (args[1] == "list" || args[1] == "lista") {
            const gifts = db.get("gifts");

            if (Object.keys(gifts).length === 0) {
                player.sendMessage("§cNão há presentes disponíveis.");
            } else {
                player.sendMessage("§aPresentes disponíveis:");
                for (const code in gifts) {
                    const gift = gifts[code];
                    player.sendMessage(
                        `§f- "§r${gift.name}§r" (Código: ${gift.code})`
                    );
                }
            }
        }

        if (args[1] == "delete" || args[1] == "deletar") {
            if (!args[2]) {
                return player.sendMessage(
                    "§cVocê precisa fornecer um código de presente para deletar. §fEx: !gift delete <código de resgate>"
                );
            }

            if (db.getV("gifts", args[2])) {
                db.remove("gifts", args[2]);
                player.sendMessage(
                    `§aPresente com o código §f"§r${args[2]}§r" §adeletado com sucesso!`
                );
            } else {
                player.sendMessage("§cCódigo de presente inválido!");
            }
        }

        if (args[1] == "clear" || args[1] == "limpar") {
            const gifts = db.get("gifts");

            if (Object.keys(gifts).length === 0) {
                player.sendMessage("§cNão há presentes para deletar.");
            } else {
                db.clear("gifts");
                player.sendMessage(
                    "§aTodos os presentes foram apagados com sucesso!"
                );
            }
        }
    }
});
