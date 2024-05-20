Projects = Projects or {}
ProjectStakers = ProjectStakers or {}

local projectIdCounter = 0

-- aajbSwRdSrIIErliiiXDvHVUkauSPa2vmBATGkjDcf4
-- .load ./process/voter.lua

function InitNewProject(name, siteURL, iconURL, stakeAmount, owner)
    return {
        Name = name,
        SiteURL = siteURL,
        IconURL = iconURL,
        Stake = stakeAmount,
        Owner = owner,
        Votes = {},
        ID = GetNewID(), --Give the projects its own id
    }
end

function GetNewID()
    projectIdCounter = projectIdCounter + 1
    return projectIdCounter
end

function InitNewProjectStaker( owner, stakeAmount )
    return {
        Owner = owner,
        Stake = stakeAmount
    }
end

-- Send({ Target = ao.id, Action = "Add-Project", Name = "Typr", SiteURL = "https://www.typr.day/", IconURL = "https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/3741374/179117_641860.jpg", Stake = "1000", Owner = ao.id })
-- Send({ Target = ao.id, Action = "Add-Project", Name = "", SiteURL = "testsite.io", IconURL = "icon.xyz", Stake = "1000", Owner = ao.id })
-- Add Project Handler
-- Handlers.add(
--     "Add-Project",
--     Handlers.utils.hasMatchingTag("Action", "Add-Project"),
--     function (msg)

--         Send({Target = "OT9qTE2467gcozb2g8R6D6N3nQS94ENcaAIJfUzHCww", Action = "Balance"})
        
--         local _balance = msg.Data
--         print("Balance: " .. _balance)
        
--         local balance_number = tonumber(_balance)

--         if( balance_number < 0.1 ) then
--             Handlers.utils.reply("Insufficient Balance")(msg)
--         else
--             local newProject = InitNewProject(msg.Name, msg.SiteURL, msg.IconURL, msg.Stake, msg.Owner)
--             print("New Project: " .. newProject.Name)
--             -- table.insert(Projects, newProject)
--             Handlers.utils.reply("Project Added: " .. msg.Name)(msg)
--         end
--     end
-- )

Handlers.add(
    "Add-Project",
    Handlers.utils.hasMatchingTag("Action", "Add-Project"),
    function (msg)
    end
)

Handlers.add(
    "Balance-Response",
    Handlers.utils.hasMatchingTag("Action", "Balance-Response"),
    function(msg)
        CurrentBalance = msg.Tags.Balance
        print("Balance updated: " .. CurrentBalance)
    end
)

function GetTrunkBalance( msg )
    Send({Target = "OT9qTE2467gcozb2g8R6D6N3nQS94ENcaAIJfUzHCww", Action = "Balance", Recipient = msg.Owner, 
    Tags = { 
        Response = "Balance-Response"
     }})
    return "0.1"
end

-- Send({ Target = ao.id, Action = "Get-Project" })
Handlers.add(
    "Get-Project",
    Handlers.utils.hasMatchingTag("Action", "Get-Project"),
    function (msg)
        Send({ Target = msg.From, Data = Projects })
        -- Handlers.utils.reply("Got All Projects " .. projectList)(msg)
    end
)

-- Testing Handler
Handlers.add(
    "Ping",
    Handlers.utils.hasMatchingTag("Action", "Ping"),
    function (msg)
        Send({ Target = msg.From, Action = "Removed", Data = "PingyPongy" })
    end
)

-- Got Some Trunk
Handlers.add(
    "Credit-Notice",
    Handlers.utils.hasMatchingTag("Action", "Credit-Notice"),
    function (msg)

        local newStaker = InitNewProjectStaker(msg.Owner, msg.Quantity)
        table.insert(ProjectStakers, newStaker)
        
        print("Got some trunk: " .. msg.Quantity)
        Handlers.utils.reply("Got some trunk")(msg)
    end
)


-- Vote Handler

-- Remove Votes Handler

-- Must add "CronTick" handler for cron to work

-- Remove Project By Admin Handler (make sure its this ao process)
-- Remove Project By Owner Handler