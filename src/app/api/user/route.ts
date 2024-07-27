import {type Prisma} from "@prisma/client";
import {NextResponse} from "next/server";
import {bcrypt, prisma} from "@/lib";
import {
  ERROR_PRISMA_VALIDATION,
  RESPONSE_MESSAGE_BAD_REQUEST,
  RESPONSE_MESSAGE_DUPLICATED_EMAIL,
  RESPONSE_MESSAGE_INTERNAL_SERVER_ERROR,
  RESPONSE_MESSAGE_INVALID_EMAIL_FORMAT,
  RESPONSE_MESSAGE_PRISMA_VALIDATION,
  RESPONSE_STATUS_BAD_REQUEST,
  RESPONSE_STATUS_CREATED,
  RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
  ROLE_CUSTOMER,
} from "@/constants";
import {validateEmailFormat, validatePhoneNumber} from "@/utils";

export async function POST(request: Request) {
  try {
    const body: Prisma.UserCreateInput = await request.json();
    console.log(body);
    if (!body.name || !body.email || !body.password || !body.phoneNumber) {
      throw new Error(RESPONSE_MESSAGE_BAD_REQUEST);
    }
    const invalidEmailFormat = !validateEmailFormat(body.email);
    if (invalidEmailFormat) {
      throw new Error(RESPONSE_MESSAGE_INVALID_EMAIL_FORMAT);
    }
    const invalidPhoneNumber = !validatePhoneNumber(body.phoneNumber);
    if (invalidPhoneNumber) {
      throw new Error("Format nomor telepon tidak sesuai");
    }
    if (!body.role) {
      body.role = ROLE_CUSTOMER;
    }
    body.password = await bcrypt.hashPassword(body.password);
    const user = await prisma.user.create({data: body});
    return NextResponse.json({user}, {status: RESPONSE_STATUS_CREATED});
  } catch (err: any) {
    console.log(err);

    let message: string = err?.message;
    let status: number = RESPONSE_STATUS_BAD_REQUEST;
    if (err?.name === ERROR_PRISMA_VALIDATION) {
      message = RESPONSE_MESSAGE_PRISMA_VALIDATION;
    }
    if (err?.meta?.target?.[0] === "email") {
      message = RESPONSE_MESSAGE_DUPLICATED_EMAIL;
    }
    if (!message) {
      message = RESPONSE_MESSAGE_INTERNAL_SERVER_ERROR;
      status = RESPONSE_STATUS_INTERNAL_SERVER_ERROR;
    }
    return NextResponse.json({message}, {status});
  }
}
