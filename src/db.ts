import duckdb = require('duckdb');

// Database initialization
const db = new duckdb.Database('mydb.duckdb');
try {
    db.run('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY, message TEXT)');
    db.run("CREATE SEQUENCE IF NOT EXISTS seq_itemid START 1;")
  } catch (error) {
    console.error(error);
  }


export function getAllItems(callback: (err: Error | null, rows: any[]) => void = console.error) {
    db.all('SELECT * FROM items', (err: Error | null, rows: any) => {
      if (err) {
        callback(err, []);
      } else {
        callback(null, rows);
      }
    });
  }

  export function getItemById(id: string, callback: (err: Error | null, row: any | null) => void = console.error) {
    db.all('SELECT * FROM items WHERE id = ?', parseInt(id, 10), (err: Error, rows: any | null) => {
      if (err) {
        callback(err, null);
      } else if (rows.length === 0) {
        callback(null, null);
      } else {
        callback(null, rows[0]);
      }
    });
  }

  export function addItem(message: string, callback: (err: Error | null) => void = console.error) {
    db.run("INSERT INTO items (id, message) VALUES (nextval('seq_itemid'), ?)", [message], (err: Error) => {
      if (err) {
        callback(err);
      } else {
        callback(null);
      }
    });
  }

  export function updateItem(id: string, message: string, callback: (err: Error | null) => void = console.error) {
    db.run('UPDATE items SET message = ? WHERE id = ?', message, parseInt(id, 10), (err: Error)  => {
      if (err) {
        callback(err);
      } else {
        callback(null);
      }
    });
  }


  export function deleteItem(id: string, callback: (err: Error | null) => void = console.error) {
    db.run('DELETE FROM items WHERE id = ?', parseInt(id, 10), (err: Error)  => {
      if (err) {
        callback(err);
      } else {
        callback(null);
      }
    });
  }