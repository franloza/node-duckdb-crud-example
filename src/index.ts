import express, { Request, Response } from 'express';
import { getAllItems, getItemById, addItem, deleteItem, updateItem } from './db';

const app = express();
const PORT = 3000;

app.get('/', (req: Request, res: Response) => {
  getAllItems((err: Error | null, rows: any[]) => {
    if (err) {
      return console.error(err.message);
    }
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Items</title>
        </head>
        <body>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map(row => `
                <tr>
                  <td>${row.id}</td>
                  <td>${row.message}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    res.send(html);
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ message: 'API is healthy' });
});

app.get('/items', (req: Request, res: Response) => {
  getAllItems((err: Error | null, rows: any[]) => {
    if (err) {
      return console.error(err.message);
    }
    res.send(rows);
  });
});

app.get('/items/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  getItemById(id, (err: Error | null, row: any) => {
    if (!row) {
      res.status(404).send('Item not found');
    } else {
      res.send(row);
    }
  });
});

app.post('/item', (req: Request, res: Response) => {
  const message = req.query.msg as string;

  if (!message) {
    return res.status(400).send('Message is required');
  }

  addItem(message , (err: Error | null) =>  {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error adding item');
    } else {
      console.log(`A new item has been added`);
      res.send(`Item saved: ${message}`);
    }
  });
});

app.put('/items/:id', (req, res) => {
  const id = req.params.id;
  const message = req.query.msg as string;

  if (!message) {
    return res.status(400).send('Message is required');
  }

  getItemById(id, (err: Error | null, row: any) => {
    if (!row) {
      res.status(404).send('Item not found');
    } else {
      updateItem(id, message, (errUpdate) => {
        if (err) {
          console.error(errUpdate.message);
          res.status(500).send('Error updating item');
        } else {
          console.log(`Item ${id} has been updated`);
          res.status(204).send();
        }
      });
    }
  })
});

app.delete('/items/:id', (req, res) => {
  const id = req.params.id;
  getItemById(id, (err: Error | null, row: any) => {
    if (!row) {
      res.status(404).send('Item not found');
    } else {
      deleteItem(id, (errDelete) => {
        if (err) {
          console.error(errDelete.message);
          res.status(500).send('Error deleting item');
        } else {
          console.log(`Item ${id} has been deleted`);
          res.status(204).send();
        }
      });
    }
  })
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
