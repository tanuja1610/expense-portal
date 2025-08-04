// backend/scripts/syncCustomers.js

const axios = require('axios');
const mysql = require('mysql2/promise');

const API_URL = 'http://103.194.8.201:1891/SapB1Api/api/SapQuery/Run?api_key=L$pl@2022&sql=SELECT%20T0.[CardCode],%20T0.[CardName],%20T1.[GroupName],%20T2.[SlpName],%20%27Silvassa%27%20AS%20[Database]%20FROM%20[LSPL_SU1_Live].dbo.OCRD%20T0%20INNER%20JOIN%20[LSPL_SU1_Live].dbo.OCRG%20T1%20ON%20T0.[GroupCode]%20=%20T1.[GroupCode]%20INNER%20JOIN%20[LSPL_SU1_Live].dbo.OSLP%20T2%20ON%20T0.[SlpCode]%20=%20T2.[SlpCode]%20WHERE%20T0.[CardType]%20=%20%27C%27%20UNION%20ALL%20SELECT%20T0.[CardCode],%20T0.[CardName],%20T1.[GroupName],%20T2.[SlpName],%20%27Gurgaon%27%20AS%20[Database]%20FROM%20[LSPL_GUR_Live].dbo.OCRD%20T0%20INNER%20JOIN%20[LSPL_GUR_Live].dbo.OCRG%20T1%20ON%20T0.[GroupCode]%20=%20T1.[GroupCode]%20INNER%20JOIN%20[LSPL_GUR_Live].dbo.OSLP%20T2%20ON%20T0.[SlpCode]%20=%20T2.[SlpCode]%20WHERE%20T0.[CardType]%20=%20%27C%27%20UNION%20ALL%20SELECT%20T0.[CardCode],%20T0.[CardName],%20T1.[GroupName],%20T2.[SlpName],%20%27Chennai%27%20AS%20[Database]%20FROM%20[LSPL_CHE_Live].dbo.OCRD%20T0%20INNER%20JOIN%20[LSPL_CHE_Live].dbo.OCRG%20T1%20ON%20T0.[GroupCode]%20=%20T1.[GroupCode]%20INNER%20JOIN%20[LSPL_CHE_Live].dbo.OSLP%20T2%20ON%20T0.[SlpCode]%20=%20T2.[SlpCode]%20WHERE%20T0.[CardType]%20=%20%27C%27%20UNION%20ALL%20SELECT%20T0.[CardCode],%20T0.[CardName],%20T1.[GroupName],%20T2.[SlpName],%20%27Equismart%27%20AS%20[Database]%20FROM%20[ETL_Live].dbo.OCRD%20T0%20INNER%20JOIN%20[ETL_Live].dbo.OCRG%20T1%20ON%20T0.[GroupCode]%20=%20T1.[GroupCode]%20INNER%20JOIN%20[ETL_Live].dbo.OSLP%20T2%20ON%20T0.[SlpCode]%20=%20T2.[SlpCode]%20WHERE%20T0.[CardType]%20=%20%27C%27%20UNION%20ALL%20SELECT%20T0.[CardCode],%20T0.[CardName],%20T1.[GroupName],%20T2.[SlpName],%20%27Crosskote%27%20AS%20[Database]%20FROM%20[CSL_Live].dbo.OCRD%20T0%20INNER%20JOIN%20[CSL_Live].dbo.OCRG%20T1%20ON%20T0.[GroupCode]%20=%20T1.[GroupCode]%20INNER%20JOIN%20[CSL_Live].dbo.OSLP%20T2%20ON%20T0.[SlpCode]%20=%20T2.[SlpCode]%20WHERE%20T0.[CardType]%20=%20%27C%27'; 

async function syncCustomers() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'expense_portal'
  });

  try {
    const { data } = await axios.get(API_URL);

    for (const customer of data) {
      const { CardCode, CardName, GroupName, SlpName, Database } = customer;
      const ID = CardCode + Database;

     
      await connection.execute(`
        INSERT INTO customer_staging (CardCode, CardName, GroupName, SlpName, DatabaseName, ID)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          CardName = VALUES(CardName),
          GroupName = VALUES(GroupName),
          SlpName = VALUES(SlpName),
          DatabaseName = VALUES(DatabaseName),
          ID = VALUES(ID)
      `, [CardCode, CardName, GroupName, SlpName, Database, ID]);
    }

  

    console.log('✅ Sync completed');
  } catch (err) {
    console.error('❌ Error syncing:', err);
  } finally {
    await connection.end();
  }
}

syncCustomers();
