from app import db


class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    contact_name = db.Column(db.String)
    contact_phone = db.Column(db.String)
    contact_email = db.Column(db.String)
    status = db.Column(db.String)
    created = db.Column(db.DateTime)
    confirmed = db.Column(db.DateTime)
    comment = db.Column(db.String)
    price = db.Column(db.Numeric(9,2))
