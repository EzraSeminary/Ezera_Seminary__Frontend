// Reset Password Component.
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useResetPasswordMutation } from "@/redux/api-slices/apiSlice";
import { toast } from "react-toastify";
