import { world } from "@minecraft/server";

// Função para obter a base de dados usando um ID
export function get(id, player = null) {
    const dbData = player 
        ? player.getDynamicProperty(id)
        : world.getDynamicProperty(id);
    return dbData ? JSON.parse(dbData) : {};
}

// Função para salvar a base de dados usando um ID
export function set(id, data, player = null) {
    const serializedData = JSON.stringify(data);
    if (player) {
        player.setDynamicProperty(id, serializedData);
    } else {
        world.setDynamicProperty(id, serializedData);
    }
}

// Função para adicionar ou atualizar uma variável
export function add(dbId, key, value, player = null) {
    const db = get(dbId, player);
    db[key] = value;
    set(dbId, db, player);
}

// Função para obter uma variável de um banco de dados
export function getV(dbId, key, player = null) {
    const db = get(dbId, player);
    return db[key];
}

// Função para remover uma variável de um banco de dados
export function remove(dbId, key, player = null) {
    const db = get(dbId, player);
    delete db[key];
    set(dbId, db, player);
}

// Função para limpar todas as variáveis de um banco de dados
export function clear(dbId, player = null) {
    set(dbId, {}, player);
}

// Função para listar todas as variáveis de um banco de dados
export function list(dbId, player = null) {
    return get(dbId, player);
}
