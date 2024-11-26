import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Clock, Users } from "lucide-react";
import { disconnectSocket, initializeSocket, getSocket } from "~/socket";
import { Socket } from "socket.io-client";
import { toast } from "./ui/use-toast";
import { useFetcher, useNavigate } from "@remix-run/react";
import { ErrorType, useToastError } from "~/hooks/useToastError";

type TicketQueueProps = {
  HOST: string;
  ticketId: string;
};

type QueueUpdateData = {
  position: number;
  totalInQueue: number;
  estimatedWaitTime: number;
};

export default function TicketQueue({ HOST, ticketId }: TicketQueueProps) {
  const [position, setPosition] = useState(0);
  const [waitTime, setWaitTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const fetcher = useFetcher<ErrorType | null | undefined>();
  useToastError(fetcher.data);

  useEffect(() => {
    if (waitTime === 0) return;

    // Set the start time when waitTime is updated
    setStartTime(Date.now());
    setTimeLeft(waitTime);
    // setProgress(0);
  }, [waitTime]);

  useEffect(() => {
    // setStartTime(Date.now());
    // setTimeLeft(waitTime);

    if (waitTime === 0 || !startTime) return;

    const interval = setInterval(() => {
      const currentTime = Date.now();
      const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
      const remaining = Math.max(waitTime - elapsedSeconds, 0);
      // const progressPercent = Math.min(((waitTime - remaining) / waitTime) * 100, 100);
      const progressPercent = Math.min(((waitTime - remaining) / waitTime) * (100 - progress), 100);
      // console.log("pro", progressPercent, waitTime, remaining);

      setTimeLeft(remaining);
      setProgress(progress + progressPercent);
      console.log(progress, progressPercent, progress + progressPercent);

      // setProgress(progressPercent);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [waitTime, startTime]);

  // useEffect(() => {
  //   // This effect will run when the waitTime changes
  //   if (waitTime === 0 || !startTime) return;

  //   // Calculate the new progress based on the updated waitTime
  //   const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
  //   const progressPercent = Math.min(
  //     ((waitTime - (waitTime - elapsedSeconds)) / waitTime) * 100,
  //     100
  //   );

  //   setTimeLeft(waitTime - elapsedSeconds);
  //   setProgress(progressPercent);
  // }, [waitTime, startTime]);

  useEffect(() => {
    const socket = initializeSocket(HOST, ticketId);

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("queue-update", (data: QueueUpdateData) => {
      console.log("From socket on queue update", data);

      if (data.position === 0) {
        navigate(`/tickets/${ticketId}`);
        toast({
          title: "Sorry",
          description: "You are no longer in the queue",
        });
        return;
      }
      setPosition(data.position);
      setWaitTime(data.estimatedWaitTime);
      const expiration = new Date();
      expiration.setSeconds(expiration.getSeconds() + data.estimatedWaitTime);
    });

    socket.on("queue-turn", (data) => {
      console.log("From socket on queue turn", data);
      const formdata = new FormData();
      formdata.append("ticketId", ticketId);

      fetcher.submit(formdata, {
        method: "post",
        action: `/tickets/${ticketId}`,
        encType: "multipart/form-data",
      });
    });

    socket.on("ticket-unavilable", () => {
      navigate("/tickets");
      toast({
        title: "Sorry",
        description: "The ticket has been purchased by another user",
      });
    });

    socket.on("opt-out-success", (data) => {
      console.log("User opted out successfully::", data);
      toast({
        title: "Opted out",
        description: "You have successfully opted out of the queue",
      });
      navigate(`/tickets/${ticketId}`);
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  const handleOptOut = () => {
    setShowModal(true);
  };

  const confirmOptOut = () => {
    setShowModal(false);
    const socket = getSocket() as Socket;
    socket.emit("opt-out", ticketId);
  };
  // console.log(timeLeft);

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="max-w-md faded-bg bg-background">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Ticket Queue
            <span className="text-sm font-normal text-muted-foreground flex items-center">
              <div className="h-2 w-2 mr-2 animate-pulse duration-1000 bg-green-500 rounded-full"></div>
              Live
            </span>
          </CardTitle>
          <CardDescription>Your position and estimated wait time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="text-lg font-medium">Position in queue: {position}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span className="text-lg font-medium">
              Estimated wait time:{" "}
              {timeLeft < 60
                ? `${timeLeft} seconds`
                : `${Math.floor(timeLeft / 60)} minutes ${
                    timeLeft - Math.floor(timeLeft / 60) * 60
                  } seconds`}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </CardContent>
        <CardFooter className="flex flex-col space-y-5">
          <Button onClick={handleOptOut} variant="destructive" className="w-full">
            Opt out of queue
          </Button>
          <p className="text-sm text-muted-foreground block">
            Please stay on this page. You will be automatically redirected to order page.
          </p>
        </CardFooter>
      </Card>

      <AlertDialog open={showModal} onOpenChange={setShowModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to opt out?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. You will lose your current position in the queue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmOptOut}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
