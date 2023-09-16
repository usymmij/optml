import asyncio
from prisma import Prisma
from prisma import Json
# TODO: update all self.db with the model data that is being found or created or updated
db = Prisma()




class Database:
    async def __init__(self) -> None:
        self.db = Prisma()
        await self.db.connect()
        print("Prisma client connected!")


    async def addModel(self) -> None:
        
        post = await self.db.OptMLModel.create({ 'flow_data' : {} })
        print(f'created post: {post.json(indent=2, sort_keys=True)}')

    async def findAllModels(self):
        
        models = await self.db.find_many()
        return models
    
    async def findModel(self, id):
        found = await self.db.OptMLModel.find_unique(where={'id': id})
        return found
    
    async def updateModel(self, id, model_data):
        update = await self.db.OptMLModel.update(
            where = { 'id': id },
            data = {'flow_data' : Json(model_data)}
        )
    async def deleteModel(self, id):
        delete = await self.db.OptMLModel.delete(
            where={
             'id': id,
            },
        )

    async def disconnect(self):
        await self.db.disconnect()



