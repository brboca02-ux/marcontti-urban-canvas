/**
 * Script de uso único — cria a conta adm@mtmobilidade.com com role admin.
 *
 * Uso:
 *   SUPABASE_SERVICE_ROLE_KEY=<sua_service_role_key> node scripts/setup-admin.mjs
 *
 * A service_role key NUNCA deve ficar salva em código ou versionada.
 * Obtenha-a em: https://supabase.com/dashboard → projeto → Settings → API → service_role
 *
 * O script é idempotente: se o usuário já existir, apenas garante a role.
 */

const SUPABASE_URL = "https://oubwnxsfuxeeueevofhj.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = "adm@mtmobilidade.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "MTadm2026";

if (!SERVICE_ROLE_KEY) {
  console.error(
    "\n❌  SUPABASE_SERVICE_ROLE_KEY não definida.\n" +
    "    Execute:\n" +
    "    $env:SUPABASE_SERVICE_ROLE_KEY='sua_chave'; node scripts/setup-admin.mjs\n"
  );
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  "apikey": SERVICE_ROLE_KEY,
  "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
};

async function apiFetch(path, method = "GET", body) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1${path}`, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok) throw Object.assign(new Error(json?.msg ?? json?.message ?? text), { status: res.status, body: json });
  return json;
}

async function restFetch(path, method = "GET", body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    method,
    headers: {
      ...headers,
      "Prefer": method === "POST" ? "return=representation,resolution=ignore-duplicates" : "return=representation",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok) throw Object.assign(new Error(JSON.stringify(json)), { status: res.status, body: json });
  return json;
}

async function main() {
  console.log(`\n🔧  Setup da conta admin — ${ADMIN_EMAIL}\n`);

  // 1. Listar usuários e verificar se já existe
  console.log("1. Verificando se o usuário já existe...");
  let userId;
  try {
    const list = await apiFetch("/admin/users?page=1&per_page=1000");
    const existing = (list.users ?? []).find((u) => u.email === ADMIN_EMAIL);
    if (existing) {
      console.log(`   ✅  Usuário já existe (id: ${existing.id})`);
      userId = existing.id;
    }
  } catch (e) {
    console.error("   ❌  Erro ao listar usuários:", e.message);
    process.exit(1);
  }

  // 2. Criar ou atualizar
  if (!userId) {
    console.log("2. Criando usuário...");
    try {
      const user = await apiFetch("/admin/users", "POST", {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,   // confirma o e-mail automaticamente (sem link)
        role: "",              // auth role — deixa vazio; a role real é na tabela user_roles
      });
      userId = user.id;
      console.log(`   ✅  Usuário criado (id: ${userId})`);
    } catch (e) {
      console.error("   ❌  Erro ao criar usuário:", e.message);
      process.exit(1);
    }
  } else {
    // Garante que a senha e e-mail_confirm estejam corretos
    console.log("2. Atualizando senha e confirmação de e-mail...");
    try {
      await apiFetch(`/admin/users/${userId}`, "PUT", {
        password: ADMIN_PASSWORD,
        email_confirm: true,
      });
      console.log("   ✅  Senha atualizada.");
    } catch (e) {
      console.error("   ❌  Erro ao atualizar usuário:", e.message);
      process.exit(1);
    }
  }

  // 3. Atribuir role admin na tabela user_roles (upsert)
  console.log("3. Atribuindo role 'admin' na tabela user_roles...");
  try {
    await restFetch(
      "/user_roles",
      "POST",
      { user_id: userId, role: "admin" }
    );
    console.log("   ✅  Role admin atribuída.");
  } catch (e) {
    // Conflito de chave única = já existe → OK
    if (e.status === 409 || String(e.message).includes("duplicate") || String(e.message).includes("unique")) {
      console.log("   ✅  Role admin já existia (sem alteração).");
    } else {
      console.error("   ❌  Erro ao atribuir role:", e.message);
      process.exit(1);
    }
  }

  // 4. Validação final
  console.log("4. Validando configuração...");
  try {
    const roles = await restFetch(`/user_roles?user_id=eq.${userId}&select=role`);
    const isAdmin = Array.isArray(roles) && roles.some((r) => r.role === "admin");
    if (isAdmin) {
      console.log("   ✅  Validação ok: user_roles contém role=admin para este usuário.");
    } else {
      console.warn("   ⚠️  Role não encontrada após inserção. Verifique a tabela user_roles manualmente.");
    }
  } catch (e) {
    console.warn("   ⚠️  Não foi possível validar:", e.message);
  }

  console.log(`
✅  CONCLUÍDO
    E-mail : ${ADMIN_EMAIL}
    Senha  : (a definida em ADMIN_PASSWORD ou o padrão fornecido)
    Role   : admin
    URL    : https://marcontti-urban-canvas.lovable.app/auth

⚠️  Guarde a senha em local seguro. Este script não exibe nem grava senhas.
`);
}

main().catch((e) => {
  console.error("Erro inesperado:", e);
  process.exit(1);
});
