import { IUsersRepository } from './../../../users/repositories/IUsersRepository';
import { ICreateTransferDTO } from './ICreateTransferDTO';
import { inject, injectable } from "tsyringe";

import { Transfer } from "../../entities/Transfer";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ITransfersRepository } from "../../repositories/ITransfersRepository";
import { CreateTransferError } from './CreateTransferError';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

@injectable()
class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,
    @inject('TransfersRepository')
    private transfersRepository: ITransfersRepository
  ) { }

  async execute({ user_id, sender_id, amount, description }: ICreateTransferDTO): Promise<Transfer> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new CreateTransferError.UserNotFound();
    }

    const userStatement = await this.statementsRepository.getUserBalance({ user_id });

    if (userStatement.balance < amount) {
      throw new CreateTransferError.InsufficientFunds();
    }

    const transfer = await this.transfersRepository.create({
      user_id,
      sender_id,
      amount,
      description
    });

    await this.statementsRepository.create({
      user_id,
      amount,
      description,
      type: OperationType.WITHDRAW,
    });

    await this.statementsRepository.create({
      user_id: `${sender_id}`,
      amount,
      description,
      type: OperationType.DEPOSIT,
    })

    return transfer
  }
}

export { CreateTransferUseCase };
