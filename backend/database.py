from prisma import Prisma, Json
from prisma.models import OptMLModel


class Database:
    def __init__(self):
        self.db = Prisma()

    async def connect(self):
        await self.db.connect()
        print("Prisma client connected!")

    async def create_model(self):
        model = await self.db.optmlmodel.create(data={
            'flow_data': Json({})
        })
        return model

    async def find_all_models(self):
        return await self.db.find_many()

    async def find_model(self, id: str) -> OptMLModel | None:
        return await self.db.optmlmodel.find_unique(where={'id': id})

    async def update_model(self, id: str, model_data: dict):
        await self.db.optmlmodel.update(
            where={'id': id},
            data={'flow_data': Json(model_data)}
        )

    async def delete_model(self, id):
        await self.db.optmlmodel.delete(
            where={
                'id': id,
            },
        )

    async def new_stats(self, model_id, accuracy: float, epoch: int, loss: float):
        await self.db.optmlmodelstats.create(data={
            'model': {
                'connect': {
                    'id': model_id
                }
            },
            'epoch': epoch,
            'accuracy': accuracy,
            'loss': loss
        })

    async def get_stats(self, model_id):
        return await self.db.optmlmodelstats.find_many(where={
            'model': {
                'id': model_id
            }
        })

    async def disconnect(self):
        await self.db.disconnect()
