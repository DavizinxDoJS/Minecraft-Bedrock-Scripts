import { world } from "@minecraft/server";

// Função para obter a base de dados usando um ID
export function get(id) {
    const dbData = world.getDynamicProperty(id);
    return dbData ? JSON.parse(dbData) : {};
}

// Função para salvar a base de dados usando um ID
export function set(id, data) {
    world.setDynamicProperty(id, JSON.stringify(data));
}

// Função para adicionar ou atualizar uma variável
export function add(dbId, key, value) {
    const db = get(dbId);
    db[key] = value;
    set(dbId, db);
}

// Função para obter uma variável de um banco de dados
export function getV(dbId, key) {
    const db = get(dbId);
    return db[key];
}

// Função para remover uma variável de um banco de dados
export function remove(dbId, key) {
    const db = get(dbId);
    delete db[key];
    set(dbId, db);
}

// Função para limpar todas as variáveis de um banco de dados
export function clear(dbId) {
    set(dbId, {});
}

// Função para listar todas as variáveis de um banco de dados
export function list(dbId) {
    return get(dbId);
}
