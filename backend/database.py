from prisma import Prisma, Json
from prisma.models import OptMLModel


class Database:
    def __init__(self):
        self.db = Prisma()

    def connect(self):
        self.db.connect()
        print("Prisma client connected!")

    def create_model(self):
        model = self.db.optmlmodel.create(data={
            'flow_data': Json({})
        })
        return model

    def find_all_models(self):
        return self.db.find_many()

    def find_model(self, id: str) -> OptMLModel | None:
        return self.db.optmlmodel.find_unique(where={'id': id})

    def update_model(self, id: str, model_data: dict):
        self.db.optmlmodel.update(
            where={'id': id},
            data={'flow_data': Json(model_data)}
        )

    def delete_model(self, id):
        self.db.optmlmodel.delete(
            where={
                'id': id,
            },
        )

    def new_stats(self, model_id: str, run_id: str, epoch: int, accuracy: float, loss: float):
        self.db.optmlmodelstats.create(data={
            'model': {
                'connect': {
                    'id': model_id
                }
            },
            'run_id': run_id,
            'epoch': epoch,
            'accuracy': accuracy,
            'loss': loss
        })

    def get_stats(self, model_id, run_id: str):
        return self.db.optmlmodelstats.find_many(where={
            'optml_id': model_id,
            'run_id': run_id
        })

    def disconnect(self):
        self.db.disconnect()
