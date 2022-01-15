import { ICreateTransferDTO } from './../useCases/createTransfer/ICreateTransferDTO';
import { Transfer } from './../entities/Transfer';

interface ITransfersRepository {
  create({ user_id, sender_id, amount, description }: ICreateTransferDTO): Promise<Transfer>;
}

export { ITransfersRepository };
