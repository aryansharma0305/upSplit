import React from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { AlarmCheck, ArrowRightLeft } from 'lucide-react'


const MemberBalances = ({  members }) => {
  return (
    <motion.section variants={cardVariants}>
    <Card className="bg-white dark:bg-gray-800 shadow-md border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold mb-3 text-emerald-600">
          Group Members
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {members
            .filter((member) => member.name !== currentUser)
            .map((member) => {
              const balance = balances[member.name];
              const isOwed = balance.net > 0;
              return (
                <motion.div
                  key={member.id}
                  variants={cardVariants}
                  className="relative rounded-md border p-4 shadow-sm bg-white dark:bg-gray-800 text-sm space-y-2"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={member.profilePic} />
                      <AvatarFallback>
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium text-base truncate">
                      {member.name}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 dark:text-gray-400">
                      You owe: ₹{balance.iOwe.toFixed(2)}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      They owe: ₹{balance.iOwed.toFixed(2)}
                    </p>
                    <p
                      className={
                        balance.net >= 0
                          ? "text-emerald-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      Net: ₹{Math.abs(balance.net).toFixed(2)}{" "}
                      {balance.net >= 0 ? "(They owe you)" : "(You owe them)"}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    {isOwed ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReminder(member.name)}
                      >
                        Send Reminder <AlarmCheck className="w-4 h-4 ml-1" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSettle(member.name)}
                      >
                        Settle Up <ArrowRightLeft className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
        </motion.div>
      </CardContent>
    </Card>
    </motion.section>
    
  )
}

export default MemberBalances