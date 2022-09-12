import 'jest';
import request from 'supertest';
import app from '../../server';

let elementId: String;

describe('GET todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos/')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        res.body.data.length = 3;
        res.body.data[0].task = 'Belajar';
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

describe('POST todo', () => {
  it('should POST a todo', (done) => {
    request(app)
      .post('/todos/')
      .expect('Content-Type', /json/)
      .send({
        task: 'Mandi',
      })
      .expect(200)
      .expect((res) => {
        res.body.data.length = 4;
        res.body.data[0].task = 'Belajar';
        res.body.data[3].task = 'Mandi';
      })
      .end((err, res) => {
        if (err) return done(err);
        elementId = res.body.data[3].id;
        return done();
      });
  });

  it('should bad request if task is not specified', (done) => {
    request(app)
      .post('/todos/')
      .expect('Content-Type', /json/)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

describe('PUT todo', () => {
  it('should PUT a todo', (done) => {
    request(app)
      .put(`/todos/${elementId}`)
      .expect('Content-Type', /json/)
      .send({
        task: 'Baca',
        isCompleted: true,
      })
      .expect(200)
      .expect((res) => {
        res.body.data.length = 4;
        res.body.data[0].task = 'Belajar';
        res.body.data[3].id = elementId;
        res.body.data[3].task = 'Baca';
      })
      .end((err, res) => {
        if (err) throw done(err);
        return done();
      });
  });

  it('should bad request if task is not specified', (done) => {
    request(app)
      .put(`/todos/${elementId}`)
      .expect('Content-Type', /json/)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should return not found if id is not found', (done) => {
    request(app)
      .put(`/todos/${elementId}-`)
      .expect('Content-Type', /json/)
      .send({
        task: 'Baca',
      })
      .expect(404)
      .end((err, res) => {
        if (err) throw done(err);
        return done();
      });
  });
});

describe('DELETE todo', () => {
  it('should DELETE a todo', (done) => {
    request(app)
      .delete(`/todos/${elementId}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw done(err);
        return done();
      });
  });

  it('should return not found if id is not found', (done) => {
    request(app)
      .delete(`/todos/${elementId}-`)
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err, res) => {
        if (err) throw done(err);
        return done();
      });
  });
});
