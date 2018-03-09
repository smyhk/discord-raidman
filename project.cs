[Command("openraid")]
        [Alias("open", "or")]
        [Summary("Creates text file to hold names and roles for sign ups")]
        public async Task OpenRaidCmd([Summary("Name for text file / name of raid, one word only.")] string raid, [Remainder, Summary("Custom message to send to signups channel")] string message = null)
        {
            string fileName = raid + ".txt";
            fileName = Path.GetFullPath(fileName).Replace(fileName, "");
            fileName = fileName + @"\raids\" + raid + ".txt";
            if (Context.Channel.Id != botChannel)
            {
                await ReplyAsync($"Please use this command in {(await Context.Guild.GetChannelAsync(botChannel) as SocketTextChannel).Mention}");
            }
            else if (File.Exists(fileName))
            {
                await ReplyAsync($"File Name {raid}.txt already exists, use another name or clear the raid.");
            }
            else
            {
                File.Create(fileName).Close();
                var channel = await Context.Guild.GetChannelAsync(signupsID) as SocketTextChannel;
                if (message == null)
                {
                    await channel.SendMessageAsync($"Raid signups now open for {raid}!");
                }
                else
                {
                    await channel.SendMessageAsync(message);
                }
            }
        }
-----------------------------------------------------------------------------------------------------------------------
 
       [Command("closeraid")]
        [Alias("clearraid", "clear", "close", "cr")]
        [Summary("Deletes signups for specified raid.")]
        public async Task CloseRaidCmd([Remainder, Summary("Name of the text file to be deleted.")] string name = null)
        {
            string sendmsg = "";

            if (Context.Channel.Id != botChannel)
            {
                sendmsg = $"Please use this command in {(await Context.Guild.GetChannelAsync(botChannel) as SocketTextChannel).Mention}";
            }
            else if (name == null)
            {
                sendmsg = "Please enter the file name with the command.";
            }
            else
            {
                try
                {

                    string fileName = name + ".txt";
                    fileName = Path.GetFullPath(fileName).Replace(fileName, "");
                    fileName = fileName + @"\raids\" + name + ".txt";
                    if (!File.Exists(fileName))
                    {
                        sendmsg = "Error: " + name + ".txt does not exist.";
                    }
                    else
                    {
                        File.Delete(fileName);
                        sendmsg = "Deleted " + name + ".txt successfully.";
                    }
                }
                catch (Exception e)
                {
                    await ReplyAsync("Exception: " + e.Message);
                }
            }

            await ReplyAsync(sendmsg);
        }
-----------------------------------------------------------------------------------------------------------------------

        [Command("rollcall")]
        [Alias("rc")]
        [Summary("Mentions users signed up for specified raid with a message that raid is forming.")]
        public async Task RollCallCmd([Summary("Name of raid to call roll call for.")] string raid = null)
        {
            if (Context.Channel.Id != botChannel)
            {
                await ReplyAsync($"Please use this command in {(await Context.Guild.GetChannelAsync(botChannel) as SocketTextChannel).Mention}");
            }
            else if (raid == null)
            {
                await ReplyAsync("Please enter the raid name with the command.");
            }
            else
            {
                string fileName = raid + ".txt";
                fileName = Path.GetFullPath(fileName).Replace(fileName, "");
                fileName = fileName + @"\raids\" + raid + ".txt";
                if (!File.Exists(fileName))
                {
                    await ReplyAsync("Error: " + raid + ".txt does not exist.");
                }
                else
                {
                    string line = "";
                    string sendmsg = "";
                    try
                    {
                        StreamReader sr = new StreamReader(fileName);
                        line = sr.ReadLine();
                        if (line == null)
                        {
                            await ReplyAsync("No users signed up for " + raid + " raid.");
                        }
                        else
                        {
                            var guild = Context.Guild as SocketGuild;
                            var users = guild.Users;
                            int count = 0;
                            while (line != null && count <= 11)
                            {
                                SocketUser player = null;
                                try
                                {
                                    player = users.Where(x => x.Username == line).First() as SocketUser;
                                }
                                catch (Exception e)
                                {
                                    Console.WriteLine($"Player {line} in {raid}.txt not found in server.");
                                }
                                if (player != null)
                                {
                                    sendmsg = sendmsg + player.Mention + " ";
                                    count++;
                                }
                                line = sr.ReadLine();
                                line = sr.ReadLine();
                            }
                            sendmsg = sendmsg + "forming up for " + raid + "! Time to log in.";
                            var channel = await Context.Guild.GetChannelAsync(announcementsID) as SocketTextChannel;
                            await channel.SendMessageAsync(sendmsg);
                        }

                        sr.Close();
                    }
                    catch (Exception e)
                    {
                        await ReplyAsync("Exception: " + e.Message);
                    }
                }
            }
        
        }
    }
}
-----------------------------------------------------------------------------------------------------------------------

{

    public class SignUp : ModuleBase
    {
        //emotes
        string tankEmote = "<url>";
        string healEmote = "<url>";
        string dpsEmote = "<url>";


        ////MS server
        ulong signupsID = 338720867921952768;

        int maxSignUps = 11;

        [Command("signup")]
        [Alias("su")]
        [Summary("Signs user up for specified raid with specified roles. Uses defualt roles if none specified.")]
        public async Task SignUpCmd([Summary("Name of raid to sign up for.")]string raid, [Summary("(Optional) Roles to sign up with."), Remainder]string roles = null)
        {
            int signUps = 0;
            bool playerAllowed = true;
            string line = "", sendmsg = "";

            //define filepath
            string fileName = raid + ".txt";
            fileName = Path.GetFullPath(fileName).Replace(fileName, "");
            fileName = fileName + @"\raids\" + raid + ".txt";

            if (Context.Channel.Id != signupsID)
            {
                var signupsChannel = await Context.Guild.GetChannelAsync(signupsID) as SocketTextChannel;
                sendmsg = $"Please use this command in the {signupsChannel.Mention} channel";
            }
            else if (!File.Exists(fileName)) //file doesnt exist
            {
                sendmsg = ($"Raid for {raid} doesn't exist!");
            }
            else
            {
                try
                {
                    //check if player is already signed up
                    StreamReader sr = new StreamReader(fileName);
                    line = sr.ReadLine();

                    //loop through file
                    while (line != null)
                    {
                        if (Context.Message.Author.Username == line)
                        {
                            //if player is found, msg sends and skips sign up process
                            sendmsg = "Only one signup allowed per person. You have already signed up.";
                            playerAllowed = false;
                        }
                        signUps++;
                        line = sr.ReadLine();
                    }
                    sr.Close();
                    signUps = (signUps) / 2;
                }
                catch (Exception e)
                {
                    await ReplyAsync("Exception: " + e.Message);
                }

                if (playerAllowed) // player not found in signup
                {
                    if (roles == null) // roles omitted, use defaults
                    {
                        bool defaultFound = false;
                        try
                        {

                            //search defaults for user
                            StreamReader sr = new StreamReader("defaults.txt");
                            line = sr.ReadLine();
                            while (line != null)
                            {
                                if (Context.Message.Author.Username == line)
                                {
                                    //user found roles are saved
                                    defaultFound = true;
                                    roles = sr.ReadLine();
                                }
                                line = sr.ReadLine();
                            }

                            if (!defaultFound) // not found in defaults.txt, uses dps as default
                            {
                                roles = "dps ";
                            }
                            sr.Close();
                            sendmsg = Context.Message.Author.Username + " has signed up as ";

                            if (roles.Contains("dps"))
                            {
                                sendmsg += "dps ";
                            }
                            if (roles.Contains("tank"))
                            {
                                sendmsg += "tank ";
                            }
                            if (roles.Contains("healer"))
                            {
                                sendmsg += "healer ";
                            }
                        }
                        catch (Exception e)
                        {
                            await ReplyAsync("Exception: " + e.Message);
                        }

                        //adds names to sign up file
                        try
                        {
                            StreamWriter sw = new StreamWriter(@fileName, true);

                            //Write a line of text
                            sw.WriteLine(Context.Message.Author.Username);
                            sw.WriteLine(roles);
                            //close the file
                            sw.Close();
                        }
                        catch (Exception e)
                        {
                            await ReplyAsync("Exception: " + e.Message);
                        }
                    }

                    //user gives roles
                    else
                    {
                        sendmsg = Context.Message.Author.Username + " has signed up as ";
                        //format roles for writing
                        string updatedRoles = "";
                        if (roles.ToUpper().Contains("DPS") || roles.ToUpper().Contains("DAMAGE"))
                        {
                            updatedRoles += "dps ";
                            sendmsg += "dps ";
                        }
                        if (roles.ToUpper().Contains("HEALER") || roles.ToUpper().Contains("HEALS") || roles.ToUpper().Contains("HEAL"))
                        {
                            updatedRoles += "healer ";
                            sendmsg += "healer ";
                        }
                        if (roles.ToUpper().Contains("TANK"))
                        {
                            updatedRoles += "tank ";
                            sendmsg += "tank ";
                        }
                        if (updatedRoles == "")
                        {
                            updatedRoles = "dps ";
                            sendmsg += "dps ";
                        }

                        //adds name and roles to file
                        try
                        {
                            StreamWriter sw = new StreamWriter(@fileName, true);

                            sw.WriteLine(Context.Message.Author.Username);
                            sw.WriteLine(updatedRoles);
                            sw.Close();
                        }
                        catch (Exception e)
                        {
                            await ReplyAsync("Exception: " + e.Message);
                        }
                    }

                    //if raid is full 
                    if (signUps >= maxSignUps)
                    {
                        sendmsg += "\nRaid is full! Signed up as overflow.";
                    }
                }
            }
            await ReplyAsync(sendmsg);
        }
-----------------------------------------------------------------------------------------------------------------------
        [Command("withdraw")]
        [Summary("Withdraws user from specified raid if signed up.")]
        public async Task WithdrawCmd([Summary("Raid to withdraw from")] string raid = null)
        {
            String line;
            string sendmsg = "";

            //define file path
            string fileName = raid + ".txt";
            fileName = Path.GetFullPath(fileName).Replace(fileName, "");
            fileName = fileName + @"\raids\" + raid + ".txt";

            int i = 0;
            List<string> names = new List<string>();
            List<string> roles = new List<string>();
            bool playerFound = false;

            if (Context.Channel.Id != signupsID)
            {
                var signupsChannel = await Context.Guild.GetChannelAsync(signupsID) as SocketTextChannel;
                sendmsg = $"Please use this command in {signupsChannel.Mention} channel.";
            }
            else if (raid == null)
            {
                sendmsg = "Please include a raid to withdraw from.";
            }
            else if (!File.Exists(fileName))
            {
                sendmsg = $"{raid} raid does not exist, use list command to see available raids.";
            }
            else
            {
                //read sign up list to see if player has already registered
                try
                {
                    StreamReader sr = new StreamReader(fileName);
                    line = sr.ReadLine();

                    //loop through file
                    while (line != null)
                    {
                        if (Context.Message.Author.Username == line)
                        {
                            //if player is found, msg sends, skips saving name and roles for rewrite
                            sendmsg = Context.Message.Author.Username + " removed from " + raid + " signups.";
                            line = sr.ReadLine();
                            playerFound = true;
                        }
                        else
                        {
                            //if not user, adds lines to names and roles for rewrite
                            names.Add(line);
                            line = sr.ReadLine();
                            roles.Add(line);
                            i++;
                        }

                        line = sr.ReadLine();
                    }
                    sr.Close();

                    //rewrite names and roles to file
                    StreamWriter sw = new StreamWriter(fileName);
                    for (int x = 0; x < i; x++)
                    {
                        sw.WriteLine(names[x]);
                        sw.WriteLine(roles[x]);
                    }
                    sw.Close();
                }
                catch (Exception e)
                {
                    await ReplyAsync("Exception: " + e.Message);
                }
                if (!playerFound) //user not in file
                {
                    sendmsg = "Player not found in signup list.";
                }
            }
            await ReplyAsync(sendmsg);
        }
-----------------------------------------------------------------------------------------------------------------------
        [Command("status")]
        [Summary("Lists players and roles signed up for specified raid.")]
        async Task TestCmd([Summary("Name of raid for status.")] string raid = null)
        {

            string line, embedmsg = "";
            int number = 0, dps = 0, tanks = 0, heals = 0;
            string fileName = raid + ".txt";
            fileName = Path.GetFullPath(fileName).Replace(fileName, "");
            fileName = fileName + @"\raids\" + raid + ".txt";

            if (Context.Channel.Id != signupsID)
            {
                var signupsChannel = await Context.Guild.GetChannelAsync(signupsID) as SocketTextChannel;
                await ReplyAsync($"Please use this command in {signupsChannel.Mention} channel.");
            }
            else if (raid == null)
            {
                await ReplyAsync("Please include the name of raid to get status for.");
            }
            else if (!File.Exists(fileName))
            {
                await ReplyAsync($"Raid for {raid} does not exist.");
            }
            else
            {
                try
                {
                    //read file, if not empty add names and roles to message
                    StreamReader sr = new StreamReader(fileName);
                    line = sr.ReadLine();
                    if (line != null)
                    {
                        //first name and roles

                        number++;
                        embedmsg = embedmsg + line + ": ";
                        line = sr.ReadLine();
                        embedmsg += line;
                        if (line.Contains("dps"))
                            dps++;
                        if (line.Contains("tank"))
                            tanks++;
                        if (line.Contains("healer"))
                            heals++;
                        line = sr.ReadLine();
                    }

                    while ((line != null)) //if more than one name in signups
                    {
                        embedmsg = embedmsg + System.Environment.NewLine + line + ": ";
                        line = sr.ReadLine();
                        embedmsg += line;
                        if (line.Contains("dps"))
                            dps++;
                        if (line.Contains("tank"))
                            tanks++;
                        if (line.Contains("healer"))
                            heals++;
                        number++;
                        line = sr.ReadLine();
                    }

                    sr.Close();
                    if (number == 0) //file is empty
                    {
                        await ReplyAsync("No players signed up for " + raid);
                        return;
                    }

                }
                catch (Exception e)
                {
                    await ReplyAsync("Exception: " + e.Message);
                }


                var builder = new EmbedBuilder()
                .WithColor(new Color(140, 255, 149))
                .WithAuthor(author =>
                {
                    author
                    .WithName($"Signup List for {raid}");
                })
                .AddField("Players:", embedmsg)
                .AddField("Role and user count:", $"{dps} dps, {tanks} tanks, {heals} healers\n{number}/11 signed up");
                var embed = builder.Build();
                await Context.Channel.SendMessageAsync("", false, embed).ConfigureAwait(false);

            }
        }

-----------------------------------------------------------------------------------------------------------------------
        [Command("raidlist")]
        [Alias("list")]
        [Summary("Lists raids availble for signups.")]
        public async Task RaidListCmd()
        {
            if (Context.Channel.Id != signupsID)
            {
                var signupsChannel = await Context.Guild.GetChannelAsync(signupsID) as SocketTextChannel;
                await ReplyAsync($"Please use this command in {signupsChannel.Mention} channel.");
            }
            else
            {
                //define file path
                string path = Path.GetFullPath("config.txt").Replace("config.txt", @"\raids");
                string[] folder = Directory.GetFiles(path);
                string sendmsg = "Available raids: ";

                //loop through array and get names of files
                foreach (string file in folder)
                {
                    string raid = file.Replace(".txt", "");
                    raid = raid.Replace(path + "\\", "");
                    sendmsg += raid + ", ";
                }
                if (folder.Count() == 0)//no files in folder
                {
                    sendmsg = "No raids available.";
                }

                await ReplyAsync(sendmsg);
            }
        }
-----------------------------------------------------------------------------------------------------------------------
        [Command("default")]
        [Summary("Sets default roles to be used for raids when roles not specified.")]
        public async Task DefaultCmd([Remainder, Summary("Roles for deafults.")]string roles = null)
        {
            if (Context.Channel.Id != signupsID)
            {
                var signupsChannel = await Context.Guild.GetChannelAsync(signupsID) as SocketTextChannel;
                await ReplyAsync($"Please use this command in {signupsChannel.Mention} channel.");
            }
            else if (roles == null) // no parameter given with command
            {
                await ReplyAsync("Please include roles with the command.");
            }
            else
            {
                string line;
                string newRoles = "";
                int i = 0;
                List<string> names = new List<string>();
                List<string> defaults = new List<string>();
                bool playerFound = false;


                //process roles and format
                if (roles.ToUpper().Contains("DPS") || roles.ToUpper().Contains("DAMAGE"))
                {
                    newRoles = newRoles + "dps ";
                }
                if (roles.ToUpper().Contains("TANK"))
                {
                    newRoles = newRoles + "tank ";
                }
                if (roles.ToUpper().Contains("HEAL") || roles.ToUpper().Contains("HEALER") || roles.ToUpper().Contains("HEALS"))
                {
                    newRoles += "healer ";
                }
                if (newRoles == "") //roles given did not contain dps tank or heal
                {
                    newRoles = "dps ";
                }

                try
                {
                    //read defaults to see if default was already given
                    StreamReader sr = new StreamReader("defaults.txt");
                    line = sr.ReadLine();

                    while (line != null)
                    {
                        if (Context.Message.Author.Username == line)
                        {
                            if (newRoles != "dps ")
                            {
                                //if player is found, msg sends, skips saving name and roles for rewrite
                                names.Add(line);
                                defaults.Add(newRoles);
                                i++;
                            }
                            line = sr.ReadLine();
                            playerFound = true;
                        }
                        else
                        {
                            //if not user, adds lines to names and roles for rewrite
                            names.Add(line);
                            line = sr.ReadLine();
                            defaults.Add(line);
                            i++;
                        }

                        line = sr.ReadLine();
                    }
                    sr.Close();

                    if (!playerFound && newRoles != "dps ") // user not already in defaults file
                    {
                        names.Add(Context.Message.Author.Username);
                        defaults.Add(newRoles);
                        i++;

                    }
                    //write names back into file
                    StreamWriter sw = new StreamWriter("defaults.txt");
                    for (int x = 0; x < i; x++)
                    {
                        sw.WriteLine(names[x]);
                        sw.WriteLine(defaults[x]);
                    }
                    sw.Close();

                    await ReplyAsync(Context.Message.Author.Username + " registered " + newRoles + "as default.");
                }
                catch (Exception e)
                {
                    await ReplyAsync("Exception: " + e.Message);
                }
            }
        }

    }
}
